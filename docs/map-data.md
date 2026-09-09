# Shanghai map

Both worlds share the same OpenStreetMap base layer. Only the Li-world labels are toggled; panning and zoom are preserved. Tiles load online from the standard OSM service with visible attribution and normal browser caching. No tile prefetch, proxy, offline download, geolocation, or geocoding runs in the app.

WGS84 anchors checked on 2026-09-09:

| Place | Li-world label | Latitude | Longitude | Source |
| --- | --- | --- | --- | --- |
| Yuqiao | 君士坦丁堡 | 31.1558316 | 121.5609656 | [Locality node](https://www.openstreetmap.org/node/11107321266) |
| Yangjing | 吐谷浑 | 31.2435273 | 121.5468943 | [Quarter node](https://www.openstreetmap.org/node/10961041533) |
| Shanghai Maritime Court | 羊关 | 31.2253329 | 121.5450202 | [Building center](https://www.openstreetmap.org/way/1267906905) |
| Century Avenue | 河西走廊 | — | — | Simplified road trace; see below |
| Shanghai Expo Park | 河套 | 31.187638 | 121.485121 | [Park coordinates](https://zh.wikipedia.org/wiki/上海世博公园) |
| Zijing Square | 大散关 | 31.277065 | 121.51242 | [Retail area](https://www.openstreetmap.org/way/1047780215) |
| Magnolia Plaza, North Bund | 兰州 | 31.2510637 | 121.4934615 | [Retail area](https://www.openstreetmap.org/way/520206081) |
| Wujiaochang | 长安 | 31.3016923 | 121.5112006 | [Quarter node](https://www.openstreetmap.org/node/9270687236) |
| Fudan University, Handan campus | 华州 · 桶关 | 31.2980617 | 121.4979245 | [University area](https://www.openstreetmap.org/relation/3936746) |
| Tongji University, Siping campus | 同州 | 31.2846675 | 121.4974304 | [University area](https://www.openstreetmap.org/relation/18788116) |
| Hongkou Football Stadium | 陕州 | 31.2733099 | 121.4763389 | [Stadium](https://www.openstreetmap.org/way/24448592) |
| Dabaishu | 虢州 | 31.294994 | 121.4852358 | [Quarter node](https://www.openstreetmap.org/node/9270687235) |

Century Avenue is drawn as one simplified line from Lujiazui toward Century Park, sampled from OSM road geometry queried on 2026-09-09. Representative source ways: [western section](https://www.openstreetmap.org/way/1108441223), [middle section](https://www.openstreetmap.org/way/10360980), [eastern section](https://www.openstreetmap.org/way/1435281197). The line represents the avenue's course rather than individual lanes. Expo uses Expo Park as a representative anchor. Both user-supplied Fudan names share one label to avoid overlapping markers; the spelling 桶关 is preserved.

The court's [official directory](https://ssyd.hshfy.sh.cn/fymap/contents/104/21.html) confirms its address at 567 Yingchun Road. Locality labels represent areas rather than street addresses. Fictional names were supplied by the user.

Map data: © OpenStreetMap contributors, [ODbL](https://www.openstreetmap.org/copyright). The vendored Leaflet 1.9.4 library retains its BSD-2-Clause license in `vendor/leaflet/LICENSE`.
