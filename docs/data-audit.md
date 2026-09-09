# Era data review — 2026-09-09

Corrected ruler attribution, restored omitted records within the represented dynasties, and checked selected year-range errors. This is a year-level lookup, not a day-level calendar conversion or an exhaustive list of Chinese rulers.

Sources used:

- [Songshi, chapter 46](https://zh.wikisource.org/wiki/宋史_(四庫全書本)/卷046): Duzong and Xianchun.
- [Chinese historical chronology](https://ytliu0.github.io/ChineseCalendar/era_names.html): cross-check of rulers, era ranges, missing eras, and inherited era numbering; the page cites Wan Guoding's chronology and other references.
- [Yuan era list](https://zh.wikipedia.org/wiki/元朝年號列表): Yuantong, Zhishun, and the short reigns of Mingzong and Ningzong.
- [Qianhua](https://zh.wikipedia.org/wiki/乾化): succession and reuse of the original era count in Later Liang.
- [Palace Museum: Jingtai](https://www.dpm.org.cn/court/lineage/226260.html): Jingtai year eight in 1457.

The regression fixtures in `tests/nianhao.test.cjs` cover the corrected ruler associations, inherited era counts, and dynasty-prefixed searches. Arithmetic roundtrips cover all stored records; those checks alone do not establish historical accuracy.

Existing Western Liao and Northern Yuan alternative chronologies remain unresolved. Year ranges do not imply that a ruler held the throne for every day of the displayed year. An era extending into January does not by itself establish an additional numbered era year; the short Wu Zhou eras retain their single-year numbering.

## Yuan and Nanzhao follow-up

Tang Suzong's unnamed interval is recorded for 761–762. [Xin Tangshu, chapter 6](https://zh.wikisource.org/zh/新唐書/卷006) records the removal of Shangyuan in the ninth lunar month of 761, use of an unnamed first year and a Jianzi year start, then restoration of Baoying in the Jiansi month (fourth lunar month) of 762. The lookup shows the interval alongside Shangyuan in 761 and Baoying in 762, with month bounds in the note and numerical era conversion disabled. It does not fabricate a Shangyuan third year or an era named Yuannian.

- [Yuanshi, chapter 38](https://zh.wikisource.org/zh/元史/卷038) places Huizong's accession in the sixth lunar month of Zhishun 4 (1333), followed by the change to Yuantong in the tenth month. Retain both names for that year, preserve the original Zhishun count, and display Huizong in both Yuan and Northern Yuan. Shundi remains a search alias. Distinguish his later Zhiyuan from Shizu's earlier era of the same name.
- [Nanzhao era chronology](https://zh.wikipedia.org/wiki/中国年号列表#南詔及大理): added 13 dated eras and one grouped record, covering 752–902. Follow the listed chronology, including Yingdao 809–810, Longxing 811–816, and Zhongxing 897–902; alternative datings exist. Undated Zhongyuan and disputed Yuanfeng are omitted.
- [Longshun's era names](https://zh.wikipedia.org/wiki/贞明承智大同): Zhenming, Chengzhi, and Datong have uncertain boundaries. Keep a grouped 877–888 record for lookup, with numerical conversion disabled rather than treating the names as one continuous era. Zanpuzhong uses the conventional 752–768 chronology with a note that its identification as an era name is disputed.

## Color convention

Liu Song uses a muted violet variant of the water palette to distinguish it from contemporary Northern Wei's blue slate.

The soft green, red, yellow, ivory, and slate palettes reference wood, fire, earth, metal, and water. Song uses fire red; Western Liao uses slate and Jin ivory. The [Five Phases overview](https://zh.wikipedia.org/wiki/五德終始說) supplies the historical reference; [research on Jin's dynastic virtue debates](https://www.cuhk.edu.hk/ics/journal/articles/v50p071.pdf) illustrates why assignments are not universal. Western Liao follows Liao visually; Yuan, Ming, Qing, Nanzhao, and other disputed cases use design choices, not claims of a settled official virtue. Colors supplement visible dynasty labels.
