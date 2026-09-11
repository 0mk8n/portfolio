# Usage: python3 scripts/compress_images.py [file ...]
#   No args: processes every .jpg/.jpeg/.png under the repo root.
#   With args: only processes the given files (e.g. newly added photos).
# Resizes to a 1900px max edge and re-encodes JPEG at quality 82.
# Fully-opaque PNGs (no real transparency) are converted to .jpg; any
# .png references to a renamed file are updated automatically in index.html.
import os
import sys
from PIL import Image, ImageOps

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MAX_DIM = 1900
JPEG_QUALITY = 82


def collect_targets():
    if len(sys.argv) > 1:
        return [os.path.abspath(p) for p in sys.argv[1:]]
    found = []
    for root, dirs, fnames in os.walk(ROOT):
        if '.git' in root.split(os.sep):
            continue
        for fname in fnames:
            if fname.lower().rsplit('.', 1)[-1] in ('jpg', 'jpeg', 'png'):
                found.append(os.path.join(root, fname))
    return found


def process(path):
    ext = path.lower().rsplit('.', 1)[-1]
    if ext not in ('jpg', 'jpeg', 'png'):
        return None
    before = os.path.getsize(path)
    im = Image.open(path)
    im = ImageOps.exif_transpose(im)
    w, h = im.size
    if max(w, h) > MAX_DIM:
        scale = MAX_DIM / max(w, h)
        im = im.resize((max(1, round(w * scale)), max(1, round(h * scale))), Image.LANCZOS)

    if ext in ('jpg', 'jpeg'):
        im.convert('RGB').save(path, 'JPEG', quality=JPEG_QUALITY, optimize=True, progressive=True)
        return path, before, os.path.getsize(path), None

    has_alpha = im.mode in ('RGBA', 'LA') or (im.mode == 'P' and 'transparency' in im.info)
    alpha_used = False
    if has_alpha:
        alpha = im.convert('RGBA').getchannel('A')
        alpha_used = alpha.getextrema()[0] < 255

    if alpha_used:
        im.convert('RGBA').save(path, 'PNG', optimize=True, compress_level=9)
        return path, before, os.path.getsize(path), None

    new_path = path.rsplit('.', 1)[0] + '.jpg'
    im.convert('RGB').save(new_path, 'JPEG', quality=JPEG_QUALITY, optimize=True, progressive=True)
    os.remove(path)
    return new_path, before, os.path.getsize(new_path), (path, new_path)


def update_html_references(renames):
    if not renames:
        return
    html_path = os.path.join(ROOT, 'index.html')
    with open(html_path, encoding='utf-8') as f:
        html = f.read()
    for old, new in renames:
        html = html.replace(f'"{os.path.relpath(old, ROOT)}"', f'"{os.path.relpath(new, ROOT)}"')
    with open(html_path, 'w', encoding='utf-8') as f:
        f.write(html)


def main():
    targets = collect_targets()
    renames = []
    total_before = total_after = 0
    for path in targets:
        if not os.path.isfile(path):
            print(f"skip (not found): {path}")
            continue
        result = process(path)
        if result is None:
            continue
        final_path, before, after, rename = result
        total_before += before
        total_after += after
        if rename:
            renames.append(rename)
        print(f"{os.path.relpath(final_path, ROOT)}: {before/1024:.0f}KB -> {after/1024:.0f}KB")

    update_html_references(renames)

    if total_before:
        print(f"\nTotal: {total_before/1024/1024:.1f}MB -> {total_after/1024/1024:.1f}MB "
              f"({(1 - total_after/total_before)*100:.1f}% smaller)")
    if renames:
        print("\nRenamed (update any other references manually, e.g. in comments or docs):")
        for old, new in renames:
            print(f"  {os.path.relpath(old, ROOT)} -> {os.path.relpath(new, ROOT)}")


if __name__ == '__main__':
    main()
