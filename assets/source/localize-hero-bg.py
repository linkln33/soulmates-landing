"""Bulgarian version of the hero composition: erase each English text line
(inpainting) and draw the Bulgarian line at the same angle, size, colour and
alignment, in Inter. Usage: localize.py SRC OUT FONT_TTF [debug.png]"""
import math, sys
import numpy as np, cv2
from PIL import Image, ImageDraw, ImageFont

SRC, OUT, FONT = sys.argv[1], sys.argv[2], sys.argv[3]
DEBUG = sys.argv[4] if len(sys.argv) > 4 else None

def box(x0, y0, x1, y1): return [(x0, y0), (x1, y0), (x1, y1), (x0, y1)]
def ocr(x, y, w, h, p=3): return box(x - p, y - p, x + w + p, y + h + p)

# (polygon, English, Bulgarian, weight, align, mode, max width factor)
L = []
def add(poly, en, bg, wght=500, align='l', mode='dark', maxf=1.25, **kw): L.append(dict(poly=poly, en=en, bg=bg, wght=wght, align=align, mode=mode, maxf=maxf, **kw))

# Phone header
add([(630, 145), (857, 128), (859, 158), (632, 173)], 'Good morning, Martin', 'Добро утро, Мартин', 700, maxf=0.94, ang=-4.6)
add(box(890, 132, 909, 150), 'EN', 'BG', 700, maxf=1.6, ang=-3.5)
add([(630, 176), (816, 162), (818, 182), (632, 194)], 'Your personal journey today', 'Твоят личен път днес', 500, ang=-3.6)
# Your day
add(box(662, 208, 735, 235), 'Your day', 'Твоят ден', 700, maxf=1.6, ang=-2.5)
add(box(635, 233, 818, 261), 'A deeper conversation could', 'По-дълбок разговор днес', 500, maxf=1.05, ang=-3.0, group='para')
add(box(634, 253, 826, 278), 'bring a beautiful breakthrough', 'може да донесе красив пробив.', 500, maxf=1.0, ang=-2.6, group='para')
add(box(634, 278, 808, 300), 'today. Trust your openness.', 'Довери се на откритостта си.', 500, maxf=1.08, ang=-2.2, group='para')
add(box(652, 303, 796, 323), 'Astrology · Numbers · Moon', 'Астрология · Числа · Луна', 500, maxf=1.15, ang=-1.5)
# Incoming matches
add(box(615, 343, 773, 373), 'Incoming matches', 'Нови съвпадения', 700, maxf=1.4, ang=-1.1)
add(box(865, 341, 931, 361), 'View feed', 'Виж всички', 600, 'r', maxf=1.6, ang=-1.1)
add(box(635, 457, 822, 479), '3 possible connections are waiting.', '3 възможни връзки те очакват.', 500, maxf=1.05, ang=0.0)
# Daily meters
add(box(604, 503, 717, 532), 'Daily meters', 'Дневни показатели', 700, maxf=2.0, ang=0.0)
add(box(847, 504, 918, 524), 'See details', 'Подробности', 600, 'r', maxf=1.6, ang=0.0)
for (x, y, w, h), en, bg in [((640, 542, 38, 13), 'Energy', 'Енергия'), ((638, 567, 63, 10), 'Connection', 'Близост'),
                             ((638, 593, 31, 10), 'Focus', 'Фокус'), ((636, 618, 87, 10), 'Communication', 'Общуване'),
                             ((635, 644, 43, 11), 'Balance', 'Баланс')]:
    add(ocr(x, y, w, h), en, bg, 600, maxf=2.2, ang=0.3, group='mname')
for (x, y, w, h), en, bg in [((884, 541, 39, 13), 'Strong', 'Силно'), ((883, 567, 39, 13), 'Steady', 'Стабилно'),
                             ((882, 593, 39, 13), 'Steady', 'Стабилно'), ((882, 619, 39, 11), 'Gentle', 'Леко'),
                             ((882, 645, 38, 11), 'Gentle', 'Леко')]:
    add(ocr(x, y, w, h), en, bg, 500, maxf=1.45, ang=0.5, group='mval')
# Explore today
add(box(588, 683, 727, 714), 'Explore today', 'Открий днес', 700, maxf=1.5, ang=0.5)
add(ocr(643, 735, 60, 19), 'Horoscope', 'Хороскоп', 700, maxf=1.3, ang=1.0, group='tt')
add(box(639, 754, 723, 771), 'Your cosmic guide', 'Космически водач', 500, maxf=1.0, ang=1.0, group='ts')
add(ocr(830, 738, 31, 11), 'Tarot', 'Таро', 700, maxf=1.6, ang=1.0, group='tt')
add(box(827, 755, 906, 772), 'Clarity & direction', 'Яснота и посока', 500, maxf=1.05, ang=1.0, group='ts')
add(ocr(639, 807, 53, 18), 'Numbers', 'Числа', 700, maxf=1.4, ang=1.0, group='tt')
add(box(635, 827, 716, 844), 'Life path & patterns', 'Жизнен път и модели', 500, maxf=1.05, ang=1.0, group='ts')
add(ocr(828, 812, 33, 12), 'Moon', 'Луна', 700, maxf=1.6, ang=1.0, group='tt')
add(box(824, 828, 894, 849), 'Cycles & timing', 'Цикли и време', 500, maxf=1.12, ang=1.0, group='ts')
# Tab bar (centred labels; TBA stays)
for (x, y, w, h), en, bg, wg in [((577, 922, 32, 10), 'Home', 'Начало', 700), ((719, 926, 44, 11), 'Matches', 'Съвпадения', 600),
                                 ((794, 928, 50, 13), 'Messages', 'Съобщения', 600), ((876, 930, 42, 13), 'Settings', 'Настройки', 600)]:
    add(ocr(x, y, w, h, 3), en, bg, wg, 'c', maxf=1.55, ang=1.5, group='tabs')
# Floating cards
add([(335, 187), (400, 171), (405, 200), (340, 215)], 'Tarot', 'Таро', 800, maxf=1.6)
add([(341, 220), (484, 184), (489, 207), (346, 235)], 'Clarity & direction', 'Яснота и посока', 500, maxf=1.08)
add([(1081, 162), (1219, 181), (1216, 209), (1079, 186)], 'Moon Phase', 'Лунна фаза', 800, mode='light', maxf=1.12, erase='poly')
add([(1079, 192), (1191, 209), (1189, 226), (1077, 206)], 'Emotional flow', 'Емоционален поток', 500, mode='light', maxf=1.3, erase='poly')
add([(242, 555), (432, 517), (437, 545), (246, 579)], 'Concealed Match', 'Възможно скрито', 800, maxf=1.08, erase='poly')
add([(247, 590), (360, 567), (365, 595), (251, 612)], 'Possibility', 'съвпадение', 800, maxf=1.4, erase='poly')
add([(1112, 526), (1277, 557), (1280, 582), (1114, 551)], 'Your Numbers', 'Твоите числа', 800, maxf=1.1, erase='poly')
add([(1102, 555), (1282, 590), (1281, 612), (1101, 577)], 'Meaning & potential', 'Значение и потенциал', 500, maxf=1.06, erase='poly')

src = Image.open(SRC).convert('RGBA')
arr = np.array(src)
rgb = np.ascontiguousarray(arr[:, :, :3]); alpha = np.ascontiguousarray(arr[:, :, 3])
gray = cv2.cvtColor(rgb, cv2.COLOR_RGB2GRAY)
H, W = gray.shape
erase = np.zeros((H, W), np.uint8)

def font(size, wght):
    f = ImageFont.truetype(FONT, max(4, int(round(size))))
    f.set_variation_by_axes([min(32, max(14, size * 0.9)), wght])
    return f

for ln in L:
    poly = np.array(ln['poly'], np.int32)
    pm = np.zeros((H, W), np.uint8); cv2.fillPoly(pm, [poly], 255)
    k = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (13, 13))
    bgest = cv2.morphologyEx(gray, cv2.MORPH_CLOSE if ln['mode'] == 'dark' else cv2.MORPH_OPEN, k)
    diff = cv2.absdiff(gray, bgest)
    m = ((diff > 28) & (pm > 0)).astype(np.uint8) * 255
    ys, xs = np.nonzero(m)
    pts = np.column_stack([xs, ys]).astype(np.float32)
    rect = cv2.minAreaRect(pts)
    bp = cv2.boxPoints(rect)
    # longest edge gives the text direction
    edges = [(bp[i], bp[(i + 1) % 4]) for i in range(4)]
    a, b = max(edges, key=lambda e: np.hypot(*(e[1] - e[0])))
    ang = math.degrees(math.atan2(b[1] - a[1], b[0] - a[0]))
    if 'ang' in ln: ang = ln['ang']
    while ang > 45: ang -= 180
    while ang < -45: ang += 180
    th = math.radians(ang); u = np.array([math.cos(th), math.sin(th)]); v = np.array([-math.sin(th), math.cos(th)])
    # extents in the text frame
    c = pts.mean(axis=0)
    pu = (pts - c) @ u; pv = (pts - c) @ v
    umin, umax, vmin, vmax = pu.min(), pu.max(), pv.min(), pv.max()
    ink_w, ink_h = umax - umin, vmax - vmin
    # colour: strongest-contrast pixels
    strong = diff[ys, xs] >= np.percentile(diff[ys, xs], 65)
    col = np.median(rgb[ys[strong], xs[strong]], axis=0).astype(int)
    # size from the English ink height in Inter
    ref = font(100, ln['wght']); eb = ref.getbbox(ln['en'])
    size = 100 * ink_h / (eb[3] - eb[1])
    f = font(size, ln['wght']); bb = f.getbbox(ln['bg'])
    maxw = ink_w * ln['maxf']
    if bb[2] - bb[0] > maxw:
        size *= maxw / (bb[2] - bb[0]); f = font(size, ln['wght']); bb = f.getbbox(ln['bg'])
    # vertical: keep the English mid-line; horizontal: per alignment
    vmid = (vmin + vmax) / 2
    left_pt = c + u * umin + v * vmid; right_pt = c + u * umax + v * vmid; mid_pt = c + u * (umin + umax) / 2 + v * vmid
    ln.update(m=m, ang=ang, size=size, col=tuple(col), f=f, bb=bb, left=left_pt, right=right_pt, mid=mid_pt, ink_h=ink_h)
    if ln.get('erase') == 'poly':
        erase |= cv2.dilate(pm, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (9, 9)))
    else:
        erase |= m

groups = {}
for ln in L:
    if 'group' in ln: groups.setdefault(ln['group'], []).append(ln)
for g in groups.values():
    s_ = min(x['size'] for x in g)
    for x in g: x['size'] = s_
para = groups.get('para', [])
if len(para) == 3:  # even line spacing
    f0, f2 = para[0]['left'], para[2]['left']
    para[1]['left'] = (f0 + f2) / 2 + np.array([0.5, 0.0]) * (para[1]['left'][0] - (f0[0] + f2[0]) / 2) * 2
mask = cv2.dilate(erase, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5)))
rgb2 = cv2.inpaint(rgb, mask, 4, cv2.INPAINT_TELEA)
alpha2 = cv2.inpaint(alpha, mask, 4, cv2.INPAINT_TELEA)
out = Image.fromarray(np.dstack([rgb2, alpha2]), 'RGBA')

S = 4  # supersampling
for ln in L:
    f = font(ln['size'] * S, ln['wght']); bb = f.getbbox(ln['bg'])
    tw, tht = bb[2] - bb[0], bb[3] - bb[1]
    pad = int(max(tw, tht)) + 8 * S
    cv = Image.new('RGBA', (tw + 2 * pad, tht + 2 * pad), (0, 0, 0, 0))
    # anchor of the ink box: left/right/centre of its middle line
    ax = {'l': pad, 'r': pad + tw, 'c': pad + tw / 2}[ln['align']]; ay = pad + tht / 2
    ImageDraw.Draw(cv).text((pad - bb[0], pad - bb[1]), ln['bg'], font=f, fill=ln['col'] + (255,))
    cv = cv.rotate(-ln['ang'], resample=Image.BICUBIC, center=(ax, ay))
    small = cv.resize((cv.width // S, cv.height // S), Image.LANCZOS)
    target = {'l': ln['left'], 'r': ln['right'], 'c': ln['mid']}[ln['align']]
    ox, oy = target[0] - ax / S, target[1] - ay / S
    layer = Image.new('RGBA', out.size, (0, 0, 0, 0)); layer.paste(small, (int(round(ox)), int(round(oy))))
    out = Image.alpha_composite(out, layer)
    print(f"{ln['en'][:24]:24} -> {ln['bg'][:26]:26} ang={ln['ang']:6.1f} size={ln['size']:5.1f} col={ln['col']}")

out.save(OUT)
if DEBUG:
    d = Image.fromarray(np.dstack([rgb, np.maximum(alpha, mask)]), 'RGBA'); dd = np.array(d); dd[mask > 0] = (255, 0, 255, 255)
    Image.fromarray(dd).save(DEBUG)
