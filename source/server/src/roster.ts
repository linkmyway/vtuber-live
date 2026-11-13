// VTuber 监控台 roster — the curated, hand-verified member list and the
// per-member primary-platform table. Pure data plus one pure resolver:
// no I/O, no database, no platform calls live here. Adding or correcting
// a member is an edit to THIS file only (populateRoster syncs it into
// the database); detection logic lives in detect.ts, actions in
// actions.ts.

// ---------------------------------------------------------------------------
// Curated roster — every channel id / room id below was verified against the
// platform itself during the build (YouTube channel pages, Bilibili user
// search API, Twitch decapi avatar lookup). Female-persona VTubers only.
// ---------------------------------------------------------------------------

export type RosterChannel = {
  platform: "youtube" | "twitch" | "bilibili";
  accountId: string;
  roomId?: string;
  handle: string;
  url: string;
  appUrl: string;
  followersLabel?: string;
};

export type RosterEntry = {
  slug: string;
  name: string;
  nameAlt: string;
  region: "jp" | "en" | "cn" | "tw";
  agency: string;
  reason: string;
  tags: string;
  sortRank: number;
  channels: RosterChannel[];
};

const yt = (slug: string, name: string, nameAlt: string, agency: string, reason: string, tags: string, sortRank: number, cid: string, handle: string): RosterEntry => ({
  slug, name, nameAlt, region: "jp", agency, reason, tags, sortRank,
  channels: [{ platform: "youtube", accountId: cid, handle, url: `https://www.youtube.com/${handle}`, appUrl: `youtube://www.youtube.com/${handle}` }],
});

export const ROSTER: RosterEntry[] = [
  // ---- 日文圈 -------------------------------------------------------------
  yt("marine", "宝钟玛琳", "宝鐘マリン", "hololive", "日圈存量王，活跃榜常年第一，杂谈和歌都稳。", "杂谈,歌,游戏", 10, "UCCzUftO8KOVkV4wQG1vkUvg", "@HoushouMarine"),
  yt("pekora", "兔田佩克拉", "兎田ぺこら", "hololive", "游戏耐久 + 整活天花板，势头常年顶。", "游戏,耐久,整活", 11, "UC1DCedRgGHBdm81E1llLhOQ", "@usadapekora"),
  yt("suisei", "星街彗星", "星街すいせい", "hololive", "歌回天花板，想听唱歌直接选她。", "歌,音乐", 12, "UC5CwaMl1eIgY8h02uZw7u8A", "@HoshimachiSuisei"),
  yt("miko", "樱巫女", "さくらみこ", "hololive", "GTA 和杂谈整活王，节目效果拉满。", "游戏,杂谈,整活", 13, "UC-hM6YJuNYVAmUWxeIr9FeA", "@SakuraMiko"),
  yt("fubuki", "白上吹雪", "白上フブキ", "hololive", "游戏杂谈全能，声线辨识度极高；另有会员限定的「月末定期ASMR」编号系列。", "ASMR,游戏,杂谈", 14, "UCdn5BQ06XqgXoAxIhbqw5Rg", "@ShirakamiFubuki"),
  yt("ayame", "百鬼绫目", "百鬼あやめ", "hololive", "近期单日涨粉并列第一，势头正热。", "游戏,杂谈", 15, "UC7fk0CB07ly8oSl0aqKkqFg", "@NakiriAyame"),
  yt("haato", "赤井心", "赤井はあと", "hololive", "近期单日涨粉并列第一，HAACHAMA 整活独一档。", "杂谈,整活", 16, "UC1CfXB_kRs3C-zaeTG3oGyg", "@AkaiHaato"),
  yt("matsuri", "夏色祭", "夏色まつり", "hololive", "3D Live 同接峰值 5.6 万，事件型爆发选手。", "歌,杂谈,3D", 17, "UCQ0UDLQCjY0rmuxCDE38FGg", "@NatsuiroMatsuri"),
  {
    slug: "kotone", name: "御子神琴音", nameAlt: "御子神コトネ", region: "jp",
    agency: "NIJISANJI", reason: "彩虹社新人涨粉连续第一：大小姐皮 + 硬核游戏佬，耐久回必看。", tags: "游戏,耐久,新人", sortRank: 18,
    channels: [{ platform: "twitch", accountId: "mikogami_kotone", handle: "mikogami_kotone", url: "https://www.twitch.tv/mikogami_kotone", appUrl: "twitch://stream/mikogami_kotone" }],
  },
  yt("asagi", "あおすずあさぎ", "Aosuzu Asagi", "ClimB Production", "陶笛 + 手风琴的治愈系 Vmusician，小体量五个月翻倍破万。", "音乐,治愈,陶笛", 19, "UCHPvqEpTP6QZ_PnPr8MYhxA", "@aosuzuasagi"),
  // ---- 英文圈 -------------------------------------------------------------
  {
    slug: "calliope", name: "Mori Calliope", nameAlt: "森カリオペ", region: "en", agency: "hololive EN",
    reason: "EN 存量头部，约 266 万订阅，月增稳。", tags: "歌,说唱,游戏", sortRank: 20,
    channels: [{ platform: "youtube", accountId: "UCL_qhgtOy0dy1Agp8vkySQg", handle: "@MoriCalliope", url: "https://www.youtube.com/@MoriCalliope", appUrl: "youtube://www.youtube.com/@MoriCalliope" }],
  },
  {
    slug: "bijou", name: "Koseki Bijou", nameAlt: "古石ビジュー", region: "en", agency: "hololive EN",
    reason: "刚破 100 万订阅，石头梗出圈，势头正旺。", tags: "游戏,杂谈", sortRank: 21,
    channels: [{ platform: "youtube", accountId: "UC9p_lqQ0FEDz327Vgf5JwqA", handle: "@kosekibijou", url: "https://www.youtube.com/@kosekibijou", appUrl: "youtube://www.youtube.com/@kosekibijou" }],
  },
  {
    slug: "shiori", name: "Shiori Novella", nameAlt: "シオリ・ノヴェラ", region: "en", agency: "hololive EN",
    reason: "稳增型代表，恐怖游戏 + 朗读氛围一流。", tags: "游戏,恐怖,朗读", sortRank: 22,
    channels: [{ platform: "youtube", accountId: "UCgnfPPb9JI3e9A4cXHnWbyg", handle: "@ShioriNovella", url: "https://www.youtube.com/@ShioriNovella", appUrl: "youtube://www.youtube.com/@ShioriNovella" }],
  },
  {
    slug: "nerissa", name: "Nerissa Ravencroft", nameAlt: "ネリッサ・レイヴンクロフト", region: "en", agency: "hololive EN",
    reason: "Advent 歌力担当，歌回质量很高。", tags: "歌,游戏", sortRank: 23,
    channels: [{ platform: "youtube", accountId: "UC_sFNM0z0MWm9A6WlKPuMMg", handle: "@NerissaRavencroft", url: "https://www.youtube.com/@NerissaRavencroft", appUrl: "youtube://www.youtube.com/@NerissaRavencroft" }],
  },
  {
    slug: "saba", name: "Sameko Saba", nameAlt: "サメコサバ", region: "en", agency: "个人势",
    reason: "英圈话题中心，新出发后热度一直没降。", tags: "游戏,杂谈", sortRank: 24,
    channels: [{ platform: "youtube", accountId: "UCxsZ6NCzjU_t4YSxQLBcM5A", handle: "@SamekoSaba", url: "https://www.youtube.com/@SamekoSaba", appUrl: "youtube://www.youtube.com/@SamekoSaba" }],
  },
  {
    slug: "ironmouse", name: "Ironmouse", nameAlt: "アイアンマウス", region: "en", agency: "VShojo",
    reason: "Twitch 女 V 存量第一，约 256 万粉丝，马拉松直播常客。", tags: "游戏,歌,马拉松", sortRank: 25,
    channels: [{ platform: "twitch", accountId: "ironmouse", handle: "ironmouse", url: "https://www.twitch.tv/ironmouse", appUrl: "twitch://stream/ironmouse", followersLabel: "Twitch 约 256 万粉丝" }],
  },
  {
    slug: "shylily", name: "Shylily", nameAlt: "シャイリリー", region: "en", agency: "个人势",
    reason: "虎鲸娘，Twitch 头部，杂谈和反应回很下饭；也是 Twitch ASMR 分类的常客（该分类累计约 137 小时）。", tags: "ASMR,杂谈,游戏", sortRank: 26,
    channels: [{ platform: "twitch", accountId: "shylily", handle: "shylily", url: "https://www.twitch.tv/shylily", appUrl: "twitch://stream/shylily" }],
  },
  {
    slug: "chibidoki", name: "chibidoki", nameAlt: "チビドキ", region: "en", agency: "个人势",
    reason: "混沌整活系，英圈切片常客，节目密度高。", tags: "整活,游戏", sortRank: 27,
    channels: [{ platform: "twitch", accountId: "chibidoki", handle: "chibidoki", url: "https://www.twitch.tv/chibidoki", appUrl: "twitch://stream/chibidoki" }],
  },
  // ---- 中文圈（Bilibili） ---------------------------------------------------
  {
    slug: "taffy", name: "永雏塔菲", nameAlt: "永雛タフィ", region: "cn", agency: "个人势",
    reason: "B站头部，王牌偶像 + 单机区主播，营业拉满。", tags: "游戏,杂谈,偶像", sortRank: 30,
    channels: [{ platform: "bilibili", accountId: "1265680561", roomId: "22603245", handle: "永雏塔菲", url: "https://live.bilibili.com/22603245", appUrl: "bilibili://live/22603245", followersLabel: "B站约 287 万粉丝" }],
  },
  {
    slug: "shinku", name: "真红莉爱", nameAlt: "真紅莉愛", region: "cn", agency: "个人势",
    reason: "异世界来的吸血鬼，会说中文，中日双语杂谈。", tags: "杂谈,歌", sortRank: 31,
    channels: [{ platform: "bilibili", accountId: "1485277312", roomId: "23611306", handle: "真红莉爱Official", url: "https://live.bilibili.com/23611306", appUrl: "bilibili://live/23611306", followersLabel: "B站约 157 万粉丝" }],
  },
  {
    slug: "jiaran", name: "嘉然", nameAlt: "嘉然今天吃什么", region: "cn", agency: "A-SOUL",
    reason: "A-SOUL 担当，吃播 + 歌舞，元气担当。", tags: "歌,舞,吃播", sortRank: 32,
    channels: [{ platform: "bilibili", accountId: "672328094", roomId: "22637261", handle: "嘉然今天吃什么", url: "https://live.bilibili.com/22637261", appUrl: "bilibili://live/22637261", followersLabel: "B站约 187 万粉丝" }],
  },
  {
    slug: "nailin", name: "乃琳", nameAlt: "乃琳Queen", region: "cn", agency: "A-SOUL",
    reason: "电台杂谈一绝，声音治愈，睡前必备。", tags: "电台,杂谈,治愈", sortRank: 33,
    channels: [{ platform: "bilibili", accountId: "672342685", roomId: "22625027", handle: "乃琳Queen", url: "https://live.bilibili.com/22625027", appUrl: "bilibili://live/22625027", followersLabel: "B站约 112 万粉丝" }],
  },
  {
    slug: "nana7mi", name: "七海", nameAlt: "七海Nana7mi", region: "cn", agency: "VirtuaReal",
    reason: "鲨鱼娘，整活 + 游戏，节目效果稳定。", tags: "游戏,整活", sortRank: 34,
    channels: [{ platform: "bilibili", accountId: "434334701", roomId: "21452505", handle: "七海Nana7mi", url: "https://live.bilibili.com/21452505", appUrl: "bilibili://live/21452505", followersLabel: "B站约 112 万粉丝" }],
  },
  {
    slug: "hinome", name: "火羽", nameAlt: "火羽ひのめ", region: "cn", agency: "个人势",
    reason: "守约四年翻红的剧情型主播：没人看也几乎每天播，10 月生日回破 3600 舰。", tags: "杂谈,剧情,每日播", sortRank: 35,
    channels: [{ platform: "bilibili", accountId: "2094031249", roomId: "22748536", handle: "火羽ひのめ", url: "https://live.bilibili.com/22748536", appUrl: "bilibili://live/22748536", followersLabel: "B站约 28 万粉丝" }],
  },
  // ---- 台湾 ---------------------------------------------------------------
  {
    slug: "anninmiru", name: "杏仁ミル", nameAlt: "Annin Miru", region: "tw", agency: "个人势",
    reason: "台 V 代表之一，杂谈歌回都稳，老牌人气。", tags: "杂谈,歌", sortRank: 40,
    channels: [{ platform: "youtube", accountId: "UCFahBR2wixu0xOex84bXFvg", handle: "@AnninMiru", url: "https://www.youtube.com/@AnninMiru", appUrl: "youtube://www.youtube.com/@AnninMiru" }],
  },
  {
    slug: "jiaotu", name: "嬌兔", nameAlt: "zrush", region: "tw", agency: "个人势",
    reason: "台湾 Twitch 头部兔系 V，台风可爱、互动黏性强。", tags: "杂谈,游戏,兔", sortRank: 110,
    channels: [{ platform: "twitch", accountId: "zrush", handle: "zrush", url: "https://www.twitch.tv/zrush", appUrl: "twitch://stream/zrush", followersLabel: "Twitch 约 28 万粉丝" }],
  },
  // ---- 扩充批（2026-11-09 逐个核验频道 ID / handle / 直播间号后加入） --------
  // 日文圈：hololive
  yt("sora", "时乃空", "ときのそら", "hololive", "hololive 初代歌姬，歌回和纪念 Live 的天花板。", "歌,音乐", 41, "UCp6993wxpyDPHUpavwDFqgg", "@TokinoSora"),
  yt("subaru", "大空昴", "大空スバル", "hololive", "元气鸭，杂谈爆发力和游戏反应都是顶级。", "杂谈,游戏,元气", 42, "UCvzGlP9oQwU--Y0r9id_jnA", "@OozoraSubaru"),
  yt("korone", "戌神沁音", "戌神ころね", "hololive", "复古游戏耐久女王，深夜长播陪伴感拉满。", "游戏,耐久,复古", 43, "UChAnqc_AY5_I3Px5dig3X1Q", "@InugamiKorone"),
  yt("okayu", "猫又小粥", "猫又おかゆ", "hololive", "低音治愈系，ASMR 常驻选手（累计 45+ 场带 ASMR 标记的直播，公开与会员场交替），游戏回也很稳。", "ASMR,杂谈,游戏,治愈", 44, "UCvaTdHTWBGv3MKj3KVqJVCw", "@NekomataOkayu"),
  yt("mio", "大神澪", "大神ミオ", "hololive", "狼妈，歌杂皆强；每月一回的【月1ASMR】是她的固定栏目。", "ASMR,歌,杂谈,游戏", 45, "UCp-5t9SrOQwXMU7iIjQfARg", "@OokamiMio"),
  yt("watame", "角卷绵芽", "角巻わため", "hololive", "羊羊歌力 + 绵芽 theater，治愈担当。", "歌,杂谈,治愈", 46, "UCqm3BQLlJfvkTsX_hvm0UmA", "@TsunomakiWatame"),
  yt("towa", "常暗永远", "常闇トワ", "hololive", "小恶魔歌姬，FPS 实力派，Live 表现力强。", "歌,游戏,FPS", 47, "UC1uv2Oq6kNxgATlCiez59hw", "@TokoyamiTowa"),
  yt("luna", "姬森璐娜", "姫森ルーナ", "hololive", "四岁公主（自称），游戏整活和幼女音反差萌。", "游戏,整活,杂谈", 48, "UCa9Y57gfeY0Zro_noHRVrnw", "@HimemoriLuna"),
  // 日文圈：NIJISANJI
  yt("mito", "月之美兔", "月ノ美兎", "NIJISANJI", "彩虹社委员长，杂谈企划的开山鼻祖之一。", "杂谈,企划", 49, "UCD-miitqNY3nyukJ4Fnf4_A", "@TsukinoMito"),
  yt("kaede", "樋口枫", "樋口楓", "NIJISANJI", "电音歌姬，歌回质量和舞台表现都是头部水准。", "歌,音乐", 50, "UCsg-YqdqQ-KFF0LNk23BY4A", "@HiguchiKaede"),
  yt("toko", "戌亥床", "戌亥とこ", "NIJISANJI", "さんばか一员，低音歌声 + 沉稳杂谈。", "歌,杂谈", 51, "UCXRlIK3Cw_TJIQC5kSJJQMg", "@InuiToko"),
  yt("ange", "安洁·卡特莉娜", "アンジュ・カトリーナ", "NIJISANJI", "炼金术师大小姐，杂谈节奏和反应一流。", "杂谈,游戏", 52, "UCHVXbQzkl3rDfsXWo8xi2qw", "@AngeKatrina"),
  yt("lize", "莉泽·赫尔艾斯塔", "リゼ・ヘルエスタ", "NIJISANJI", "王国第二王女，游戏杂谈均衡，皇女梗常驻。", "游戏,杂谈", 53, "UCZ1xuCK1kNmn5RzPYIZop3w", "@LizeHelesta"),
  yt("saku", "笹木咲", "笹木咲", "NIJISANJI", "熊猫系元气担当，游戏回笑点密度高。", "游戏,杂谈,元气", 54, "UCoztvTULBYd3WmStqYeoHcA", "@SasakiSaku"),
  yt("himawari", "本间向日葵", "本間ひまわり", "NIJISANJI", "向日葵系 FPS 选手，游戏大会常客。", "游戏,FPS", 55, "UC0g1AE0DOjBYnLhkgoRWN1w", "@HonmaHimawari"),
  yt("mahiro", "雪城真寻", "雪城眞尋", "NIJISANJI", "睡眠导入和耳搔 ASMR 的代表选手，睡前场首选。", "ASMR,睡眠,杂谈", 56, "UCHX7YpFG8rVwhsHCx34xt7w", "@YukishiroMahiro"),
  // 日文圈：VSPO!
  yt("sumire", "花芽堇", "花芽すみれ", "VSPO!", "VSPO 歌姬担当，温柔歌声 + 游戏兼备。", "歌,游戏", 57, "UCyLGcqYs7RsBb3L0SJfzGYA", "@KagaSumire"),
  yt("uruha", "一之濑丽羽", "一ノ瀬うるは", "VSPO!", "VSPO 头部之一，FPS 和杂谈都稳，黏性极强。", "游戏,FPS,杂谈", 58, "UC5LyYg6cCA4yHEYvtUsir3g", "@uruhaichinose"),
  yt("noah", "胡桃诺娅", "胡桃のあ", "VSPO!", "猫系 FPS 选手，歌回反差萌。", "游戏,FPS,歌", 59, "UCIcAj6WkJ8vZ7DeJVgmeqKw", "@963Noah"),
  // 日文圈：个人势 / 其他
  {
    slug: "ui", name: "时雨羽衣", nameAlt: "しぐれうい", region: "jp", agency: "个人势",
    reason: "插画家本人出道，230 万订阅的个人势顶流，杂谈和绘画回独一档。", tags: "杂谈,绘画,歌", sortRank: 60,
    channels: [
      { platform: "youtube", accountId: "UCt30jJgChL8qeT9VPadidSw", handle: "@ui_shig", url: "https://www.youtube.com/@ui_shig", appUrl: "youtube://www.youtube.com/@ui_shig" },
      { platform: "bilibili", accountId: "2601367", roomId: "9389401", handle: "時雨羽衣Official", url: "https://live.bilibili.com/9389401", appUrl: "bilibili://live/9389401", followersLabel: "B站约 113 万粉丝" },
    ],
  },
  yt("sana", "名取纱那", "名取さな", "个人势", "虚拟护士，段子和网络梗造诣极深的老牌个人势。", "杂谈,游戏,梗", 61, "UCIdEIHpS0TdkqRkHL5OkLtA", "@sana_natori"),
  yt("roa", "海月云罗亚", "海月雲ろあ", "个人势", "水母系新人，出道半年冲到 35 万订阅的 chill 系黑马。", "杂谈,歌,治愈", 62, "UCLIpj4TmXviSTNE_U5WG_Ug", "@KurageuRoa"),
  yt("ruka", "雨海露卡", "雨海ルカ", "个人势", "海豚少女，初配信同接 14 万的现象级新人，歌杂皆强。", "歌,杂谈", 63, "UClS3cnIUM9yzsBPQzeyX_8Q", "@RukaCh.雨海ルカ"),
  yt("sakuna", "结城昨奈", "結城さくな", "个人势", "猫系女仆，初配信同接 38 万创纪录，两个月破百万订阅。", "游戏,歌,女仆", 64, "UCrV1Hf5r8P148idjoSfrGEQ", "@結城さくな"),
  yt("patra", "周防帕特拉", "周防パトラ", "HoneyStrap", "ASMR 女王：耳搔、耳语、双耳录音的代名词，睡前必看。", "ASMR,耳搔,歌", 65, "UCeLzT-7b2PBcunJplmWtoDg", "@Patra_Suou"),
  yt("ena", "莓冰惠娜", "苺氷えな", "个人势", "猫系 ASMR 担当，每周三、六深夜固定 ASMR 场。", "ASMR,游戏,猫", 66, "UCDhFPOhFxEdegzifhkPrACg", "@itigoriena"),
  // 英文圈：hololive EN
  {
    slug: "kiara", name: "Takanashi Kiara", nameAlt: "小鳥遊キアラ", region: "en", agency: "hololive EN",
    reason: "凤凰战士，EN 杂谈和联动的气氛发动机。", tags: "杂谈,歌,游戏", sortRank: 70,
    channels: [{ platform: "youtube", accountId: "UCHsx4Hqa-1ORjQTh9TYDhww", handle: "@TakanashiKiara", url: "https://www.youtube.com/@TakanashiKiara", appUrl: "youtube://www.youtube.com/@TakanashiKiara" }],
  },
  {
    slug: "ina", name: "Ninomae Ina'nis", nameAlt: "一伊那尓栖", region: "en", agency: "hololive EN",
    reason: "章鱼祭司，绘画回和治愈杂谈是 EN 的深夜食堂。", tags: "绘画,杂谈,治愈", sortRank: 71,
    channels: [{ platform: "youtube", accountId: "UCMwGHR0BTZuLsmjY_NT5Pwg", handle: "@NinomaeInanis", url: "https://www.youtube.com/@NinomaeInanis", appUrl: "youtube://www.youtube.com/@NinomaeInanis" }],
  },
  {
    slug: "baelz", name: "Hakos Baelz", nameAlt: "ハコス・ベールズ", region: "en", agency: "hololive EN",
    reason: "混沌老鼠，游戏整活和歌回爆发力都强。", tags: "游戏,整活,歌", sortRank: 72,
    channels: [{ platform: "youtube", accountId: "UCgmPnx-EEeOrZSg5Tiw7ZRQ", handle: "@HakosBaelz", url: "https://www.youtube.com/@HakosBaelz", appUrl: "youtube://www.youtube.com/@HakosBaelz" }],
  },
  {
    slug: "kronii", name: "Ouro Kronii", nameAlt: "オーロ・クロニー", region: "en", agency: "hololive EN",
    reason: "时间守护者，低音声线 + 冷面笑匠式杂谈。", tags: "杂谈,游戏", sortRank: 73,
    channels: [{ platform: "youtube", accountId: "UCmbs8T6MWqUHP1tIQvSgKrg", handle: "@OuroKronii", url: "https://www.youtube.com/@OuroKronii", appUrl: "youtube://www.youtube.com/@OuroKronii" }],
  },
  {
    slug: "irys", name: "IRyS", nameAlt: "アイリス", region: "en", agency: "hololive EN",
    reason: "希望与堕天使的半天使，歌力是 EN 顶梁柱。", tags: "歌,音乐,游戏", sortRank: 74,
    channels: [{ platform: "youtube", accountId: "UC8rcEBzJSleTkf_-agPM20g", handle: "@IRyS", url: "https://www.youtube.com/@IRyS", appUrl: "youtube://www.youtube.com/@IRyS" }],
  },
  {
    slug: "gigi", name: "Gigi Murin", nameAlt: "ジジ・ムリン", region: "en", agency: "hololive EN",
    reason: "Justice 的小恶魔，游戏整活能量爆棚。", tags: "游戏,整活", sortRank: 75,
    channels: [{ platform: "youtube", accountId: "UCDHABijvPBnJm7F-KlNME3w", handle: "@holoen_gigimurin", url: "https://www.youtube.com/@holoen_gigimurin", appUrl: "youtube://www.youtube.com/@holoen_gigimurin" }],
  },
  {
    slug: "cecilia", name: "Cecilia Immergreen", nameAlt: "セシリア・イマーグリーン", region: "en", agency: "hololive EN",
    reason: "发条人偶小姐，小提琴和建模/游戏都认真的全能型。", tags: "音乐,游戏,杂谈", sortRank: 76,
    channels: [{ platform: "youtube", accountId: "UCvN5h1ShZtc7nly3pezRayg", handle: "@holoen_ceciliaimmergreen", url: "https://www.youtube.com/@holoen_ceciliaimmergreen", appUrl: "youtube://www.youtube.com/@holoen_ceciliaimmergreen" }],
  },
  {
    slug: "raora", name: "Raora Panthera", nameAlt: "ラオーラ・パンテーラ", region: "en", agency: "hololive EN",
    reason: "粉豹画师，绘画回和意大利式热情杂谈。", tags: "绘画,杂谈", sortRank: 77,
    channels: [{ platform: "youtube", accountId: "UCl69AEx4MdqMZH7Jtsm7Tig", handle: "@holoen_raorapanthera", url: "https://www.youtube.com/@holoen_raorapanthera", appUrl: "youtube://www.youtube.com/@holoen_raorapanthera" }],
  },
  {
    slug: "elizabeth", name: "Elizabeth Rose Bloodflame", nameAlt: "エリザベス・ローズ・ブラッドフレイム", region: "en", agency: "hololive EN",
    reason: "Justice 队长，歌剧级唱功 + 骑士团长的反差。", tags: "歌,音乐", sortRank: 78,
    channels: [{ platform: "youtube", accountId: "UCW5uhrG1eCBYditmhL0Ykjw", handle: "@holoen_erbloodflame", url: "https://www.youtube.com/@holoen_erbloodflame", appUrl: "youtube://www.youtube.com/@holoen_erbloodflame" }],
  },
  // 英文圈：Phase Connect
  {
    slug: "lumi", name: "Kaneko Lumi", nameAlt: "金子瑠美", region: "en", agency: "Phase Connect",
    reason: "星尘少女，游戏耐久和歌回都硬核，Twitch / YouTube 双栖。", tags: "游戏,歌,耐久", sortRank: 79,
    channels: [
      { platform: "youtube", accountId: "UCx_zwZuGIS4jxO07kFk8G6Q", handle: "@KanekoLumi", url: "https://www.youtube.com/@KanekoLumi", appUrl: "youtube://www.youtube.com/@KanekoLumi" },
      { platform: "twitch", accountId: "kanekolumi", handle: "kanekolumi", url: "https://www.twitch.tv/kanekolumi", appUrl: "twitch://stream/kanekolumi" },
    ],
  },
  {
    slug: "pippa", name: "Pipkin Pippa", nameAlt: "ピップキン・ピッパ", region: "en", agency: "Phase Connect",
    reason: "粉兔整活王，话题制造机，英圈切片常客。", tags: "整活,杂谈,游戏", sortRank: 80,
    channels: [{ platform: "youtube", accountId: "UCJ46YTYBQVXsfsp8-HryoUA", handle: "@PipkinPippa", url: "https://www.youtube.com/@PipkinPippa", appUrl: "youtube://www.youtube.com/@PipkinPippa" }],
  },
  {
    slug: "tenma", name: "Tenma Maemi", nameAlt: "天満マエミ", region: "en", agency: "Phase Connect",
    reason: "狐狸酒保（自称），硬核游戏 + 醉酒杂谈名场面多。", tags: "游戏,杂谈", sortRank: 81,
    channels: [{ platform: "youtube", accountId: "UC3K7pmiHsNSx1y0tdx2bbCw", handle: "@TenmaMaemi", url: "https://www.youtube.com/@TenmaMaemi", appUrl: "youtube://www.youtube.com/@TenmaMaemi" }],
  },
  // 英文圈：VShojo 系 / Twitch 头部 / ASMR
  {
    slug: "bao", name: "Bao", nameAlt: "バオ", region: "en", agency: "个人势",
    reason: "鲸鱼娘，歌回和整活杂谈在英圈人气长青。", tags: "歌,杂谈,整活", sortRank: 82,
    channels: [
      { platform: "twitch", accountId: "bao", handle: "bao", url: "https://www.twitch.tv/bao", appUrl: "twitch://stream/bao" },
      { platform: "youtube", accountId: "UCZQ7nZ8Lc7pslBN0gN1Jg0w", handle: "@baovtuber", url: "https://www.youtube.com/@baovtuber", appUrl: "youtube://www.youtube.com/@baovtuber" },
    ],
  },
  {
    slug: "nyanners", name: "Nyanners", nameAlt: "ニャンナーズ", region: "en", agency: "个人势",
    reason: "粉猫元老，配音梗和整活杂谈是英圈活化石级存在。", tags: "杂谈,整活,配音", sortRank: 83,
    channels: [{ platform: "twitch", accountId: "nyanners", handle: "nyanners", url: "https://www.twitch.tv/nyanners", appUrl: "twitch://stream/nyanners" }],
  },
  {
    slug: "froot", name: "Apricot", nameAlt: "アプリコット（Froot）", region: "en", agency: "VShojo",
    reason: "巫妖小姐，绘画回和温柔杂谈，VShojo 创始成员。", tags: "绘画,杂谈", sortRank: 84,
    channels: [{ platform: "twitch", accountId: "froot", handle: "froot", url: "https://www.twitch.tv/froot", appUrl: "twitch://stream/froot" }],
  },
  {
    slug: "melody", name: "Projekt Melody", nameAlt: "プロジェクト・メロディ", region: "en", agency: "个人势",
    reason: "AI 少女始祖级人物，游戏和杂谈节目感强。", tags: "游戏,杂谈", sortRank: 85,
    channels: [{ platform: "twitch", accountId: "projektmelody", handle: "projektmelody", url: "https://www.twitch.tv/projektmelody", appUrl: "twitch://stream/projektmelody" }],
  },
  {
    slug: "zentreya", name: "Zentreya", nameAlt: "ゼントレヤ", region: "en", agency: "个人势",
    reason: "红龙 TTS 互动女王，RP 和整活直播独一档。", tags: "整活,游戏,RP", sortRank: 86,
    channels: [{ platform: "twitch", accountId: "zentreya", handle: "zentreya", url: "https://www.twitch.tv/zentreya", appUrl: "twitch://stream/zentreya" }],
  },
  {
    slug: "cottontail", name: "CottontailVA", nameAlt: "コットンテイル", region: "en", agency: "个人势",
    reason: "英圈 ASMR + 配音代表，耳语和角色扮演音频是招牌。", tags: "ASMR,配音", sortRank: 87,
    channels: [
      { platform: "youtube", accountId: "UCgfRDtfK0QDlE0RaDWp5baw", handle: "@CottontailVA", url: "https://www.youtube.com/@CottontailVA", appUrl: "youtube://www.youtube.com/@CottontailVA" },
      { platform: "twitch", accountId: "cottontailva", handle: "cottontailva", url: "https://www.twitch.tv/cottontailva", appUrl: "twitch://stream/cottontailva" },
    ],
  },
  {
    slug: "rollcake", name: "Roll Cake", nameAlt: "ロールケーキ", region: "en", agency: "Magical Sciences International",
    reason: "异星魔法少女，Twitch ASMR 分类常客、3DIO ASMR 专场（近 90 天 29 场中 ASMR 占 12 场、与 FF7 并列第一，【LIVE 3DIO ASMR】【ASMR GAMING】与耳掻き/whisper 场次密集），舒缓杂谈和慢节奏治愈场。", tags: "ASMR,治愈,杂谈", sortRank: 88,
    channels: [{ platform: "twitch", accountId: "rollcake", handle: "rollcake", url: "https://www.twitch.tv/rollcake", appUrl: "twitch://stream/rollcake" }],
  },
  {
    slug: "silvervale", name: "Silvervale", nameAlt: "シルバーベール", region: "en", agency: "Mythic Talent",
    reason: "樱花狼娘，游戏 + free talk 的老牌全能选手（ASMR 是她早年的内容，近年已基本不做）。", tags: "游戏,杂谈", sortRank: 89,
    channels: [{ platform: "twitch", accountId: "silvervale", handle: "silvervale", url: "https://www.twitch.tv/silvervale", appUrl: "twitch://stream/silvervale" }],
  },
  {
    slug: "fallenshadow", name: "fallenshadow", nameAlt: "Shondo", region: "en", agency: "个人势",
    reason: "ASMR 出身的影之主播，2024 VTuber Awards 最佳 RP/ASMR 提名。", tags: "ASMR,RP,杂谈", sortRank: 90,
    channels: [{ platform: "twitch", accountId: "fallenshadow", handle: "fallenshadow", url: "https://www.twitch.tv/fallenshadow", appUrl: "twitch://stream/fallenshadow" }],
  },
  // 中文圈扩充（Bilibili）
  {
    slug: "bella", name: "贝拉", nameAlt: "贝拉kira", region: "cn", agency: "A-SOUL",
    reason: "A-SOUL 队长，舞蹈和体能担当，舞台表现力强。", tags: "舞,歌", sortRank: 100,
    channels: [{ platform: "bilibili", accountId: "672353429", roomId: "22632424", handle: "贝拉kira", url: "https://live.bilibili.com/22632424", appUrl: "bilibili://live/22632424", followersLabel: "B站约 74 万粉丝" }],
  },
  {
    slug: "xiangwan", name: "向晚", nameAlt: "向晚大魔王", region: "cn", agency: "A-SOUL",
    reason: "A-SOUL 游戏担当，魔王系杂谈，节目效果稳定。", tags: "游戏,杂谈", sortRank: 101,
    channels: [{ platform: "bilibili", accountId: "672346917", roomId: "22625025", handle: "向晚大魔王", url: "https://live.bilibili.com/22625025", appUrl: "bilibili://live/22625025", followersLabel: "B站约 53 万粉丝" }],
  },
  {
    slug: "lingyuan", name: "泠鸢", nameAlt: "泠鸢yousa", region: "cn", agency: "个人势",
    reason: "B站虚拟歌姬元老，原创曲和歌回是中文圈活化石。", tags: "歌,原创", sortRank: 102,
    channels: [{ platform: "bilibili", accountId: "282994", roomId: "47377", handle: "泠鸢yousa", url: "https://live.bilibili.com/47377", appUrl: "bilibili://live/47377", followersLabel: "B站约 342 万粉丝" }],
  },
  {
    slug: "nanako", name: "菜菜子", nameAlt: "菜菜子Nanako", region: "cn", agency: "VirtuaReal",
    reason: "VirtuaReal 头部，杂谈和整活在 B站女 V 里长年靠前。", tags: "杂谈,整活", sortRank: 103,
    channels: [{ platform: "bilibili", accountId: "595407557", roomId: "22359795", handle: "菜菜子Nanako", url: "https://live.bilibili.com/22359795", appUrl: "bilibili://live/22359795", followersLabel: "B站约 218 万粉丝" }],
  },
  {
    slug: "azi", name: "阿梓", nameAlt: "阿梓从小就很可爱", region: "cn", agency: "个人势",
    reason: "B站头部杂谈势，脱口秀式聊天和切片传播力强。", tags: "杂谈,整活", sortRank: 104,
    channels: [{ platform: "bilibili", accountId: "7706705", roomId: "80397", handle: "阿梓从小就很可爱", url: "https://live.bilibili.com/80397", appUrl: "bilibili://live/80397", followersLabel: "B站约 122 万粉丝" }],
  },
  // ---- 补厚批（2026-11-09 二轮：Veibae + 小社团补到 4–6 人，逐个核验） ----
  {
    slug: "veibae", name: "Veibae", nameAlt: "Vei", region: "en", agency: "Mythic Talent",
    reason: "银白长发魅魔出身（现天空女帝形象），英国英文圈；前 VShojo（2021–2023），现 Mythic Talent 经纪、独立活动，长期休止后近期复归，Twitch 为主。", tags: "杂谈,游戏,魅魔", sortRank: 91,
    channels: [
      { platform: "twitch", accountId: "vei", handle: "vei", url: "https://www.twitch.tv/vei", appUrl: "twitch://stream/vei", followersLabel: "Twitch 100 万+ 粉丝" },
      { platform: "youtube", accountId: "UCsBFeCb82qOXyUP19nmD9xw", handle: "@Veibae", url: "https://www.youtube.com/@Veibae", appUrl: "youtube://www.youtube.com/@Veibae" },
    ],
  },
  // VSPO! 补厚（3 → 6）
  {
    slug: "beni", name: "八雲べに", nameAlt: "Yakumo Beni", region: "jp", agency: "VSPO!",
    reason: "VSPO 的时尚担当，VALORANT 和杂谈都在线，66 万订阅量级。YouTube 与 Twitch（yakumobeni）双阵地，Twitch 侧多为 FPS 专场。", tags: "游戏,FPS,杂谈", sortRank: 105,
    channels: [
      { platform: "youtube", accountId: "UCjXBuHmWkieBApgBhDuJMMQ", handle: "@八雲べに", url: "https://www.youtube.com/@八雲べに", appUrl: "youtube://www.youtube.com/@八雲べに" },
      { platform: "twitch", accountId: "yakumobeni", handle: "yakumobeni", url: "https://www.twitch.tv/yakumobeni", appUrl: "twitch://stream/yakumobeni" },
    ],
  },
  yt("ema", "蓝泽艾玛", "藍沢エマ", "VSPO!", "VSPO 新生代，歌回和游戏都稳，元气声线辨识度高。", "歌,游戏", 106, "UCPkKpOHxEDcwmUAnRpIu-Ng", "@AizawaEma"),
  yt("runa", "紫宫露娜", "紫宮るな", "VSPO!", "VSPO 猫系担当，游戏耐久和撒娇杂谈反差大。", "游戏,杂谈", 107, "UCD5W21JqNMv_tV9nfjvF9sw", "@shinomiyaruna"),
  // HoneyStrap 补厚（1 → 4）
  yt("mary", "西园寺玛丽", "西園寺メアリ", "HoneyStrap", "HoneyStrap 的お姉さん担当，ASMR 和治愈杂谈是招牌。", "ASMR,杂谈,治愈", 108, "UCwePpiw1ocZRSNSkpKvVISw", "@Mary_Saionji"),
  yt("charlotte", "岛村夏洛特", "島村シャルロット", "HoneyStrap", "HoneyStrap 吸血鬼大小姐，歌回和杂谈都走治愈路线。", "歌,杂谈,治愈", 109, "UCYTz3uIgwVY3ZU-IQJS8r3A", "@Charlotte_Shimamura"),
  yt("miko_sekishiro", "堰代米可", "堰代ミコ", "HoneyStrap", "HoneyStrap 的巫女担当，游戏和杂谈节目感强。", "杂谈,游戏", 111, "UCDh2bWI5EDu7PavqwICkVpA", "@Mico_Sekishiro"),
  // Phase Connect 补厚（3 → 6）
  {
    slug: "shiina", name: "Amanogawa Shiina", nameAlt: "天ノ川しいな", region: "en", agency: "Phase Connect",
    reason: "Phase Connect 一期生，手工 + 杂谈 + 歌的治愈系全能选手。", tags: "杂谈,歌,手工", sortRank: 112,
    channels: [{ platform: "youtube", accountId: "UCnJNNk45O1QYS2oMRYFKSyw", handle: "@AmanogawaShiina", url: "https://www.youtube.com/@AmanogawaShiina", appUrl: "youtube://www.youtube.com/@AmanogawaShiina" }],
  },
  {
    slug: "uruka", name: "Fujikura Uruka", nameAlt: "藤倉ウルカ", region: "en", agency: "Phase Connect",
    reason: "蓝熊音乐人，小提琴和歌回是招牌，游戏也打得认真。", tags: "音乐,歌,游戏", sortRank: 113,
    channels: [{ platform: "youtube", accountId: "UCjXJYPsKxoJyc-1RPB6dSyw", handle: "@FujikuraUruka", url: "https://www.youtube.com/@FujikuraUruka", appUrl: "youtube://www.youtube.com/@FujikuraUruka" }],
  },
  {
    slug: "lia", name: "Rinkou Ashelia", nameAlt: "鈴香アシェリア", region: "en", agency: "Phase Connect",
    reason: "Phase Connect 的整活担当（Lia），话题和节目密度都高。", tags: "整活,杂谈,游戏", sortRank: 114,
    channels: [{ platform: "youtube", accountId: "UCg7sW-h1PUowdiR5K4HlBew", handle: "@RinkouAshelia", url: "https://www.youtube.com/@RinkouAshelia", appUrl: "youtube://www.youtube.com/@RinkouAshelia" }],
  },
  // NIJISANJI EN 新组（4 人）
  {
    slug: "enna", name: "Enna Alouette", nameAlt: "エナー・アールウェット", region: "en", agency: "NIJISANJI EN",
    reason: "天堂的歌鸟，EN 歌力天花板之一，杂谈毒舌又好笑。", tags: "歌,杂谈", sortRank: 115,
    channels: [{ platform: "youtube", accountId: "UCR6qhsLpn62WVxCBK1dkLow", handle: "@EnnaAlouette", url: "https://www.youtube.com/@EnnaAlouette", appUrl: "youtube://www.youtube.com/@EnnaAlouette" }],
  },
  {
    slug: "millie", name: "Millie Parfait", nameAlt: "ミリー・パフェ", region: "en", agency: "NIJISANJI EN",
    reason: "小女巫，游戏整活和恐怖游戏回的节目效果拉满。", tags: "游戏,整活,杂谈", sortRank: 116,
    channels: [{ platform: "youtube", accountId: "UC47rNmkDcNgbOcM-2BwzJTQ", handle: "@MillieParfait", url: "https://www.youtube.com/@MillieParfait", appUrl: "youtube://www.youtube.com/@MillieParfait" }],
  },
  {
    slug: "finana", name: "Finana Ryugu", nameAlt: "フィナーナ・竜宮", region: "en", agency: "NIJISANJI EN",
    reason: "人鱼歌姬，歌回治愈、游戏回闹腾，反差是招牌。", tags: "歌,游戏,杂谈", sortRank: 117,
    channels: [{ platform: "youtube", accountId: "UCu-J8uIXuLZh16gG-cT1naw", handle: "@FinanaRyugu", url: "https://www.youtube.com/@FinanaRyugu", appUrl: "youtube://www.youtube.com/@FinanaRyugu" }],
  },
  {
    slug: "maria", name: "Maria Marionette", nameAlt: "マリア・マリオネット", region: "en", agency: "NIJISANJI EN",
    reason: "人偶小姐，歌回质量高，杂谈走软萌治愈路线。", tags: "歌,杂谈,游戏", sortRank: 118,
    channels: [{ platform: "youtube", accountId: "UCwaS8_S7kMiKA3izlTWHbQg", handle: "@MariaMarionette", url: "https://www.youtube.com/@MariaMarionette", appUrl: "youtube://www.youtube.com/@MariaMarionette" }],
  },
  // VShojo 系补厚（2 → 4）
  {
    slug: "michi", name: "Michi Mochievee", nameAlt: "ミチ・モチビー", region: "en", agency: "VShojo",
    reason: "VShojo 系整活担当，印尼出身，Twitch 杂谈和联动节目感强。", tags: "杂谈,整活,游戏", sortRank: 119,
    channels: [{ platform: "twitch", accountId: "michimochievee", handle: "michimochievee", url: "https://www.twitch.tv/michimochievee", appUrl: "twitch://stream/michimochievee" }],
  },
  {
    slug: "matara", name: "Matara Kan", nameAlt: "マタラ・カン", region: "en", agency: "VShojo",
    reason: "VShojo 系的话题中心，「蟑螂妈妈」杂谈和联动都很能打。", tags: "杂谈,游戏,联动", sortRank: 120,
    channels: [{ platform: "twitch", accountId: "matarakan", handle: "matarakan", url: "https://www.twitch.tv/matarakan", appUrl: "twitch://stream/matarakan" }],
  },
  // ---- 补厚三轮（审计点名社团：あおぎり高校 / Neo-Porte / のりプロ / Re:AcT / VirtuaReal） ----
  // 核验方式：YouTube 搜索结果的频道标题逐一对名 + 频道页 externalId / handle / 头像；
  // 标题带【卒業】【活動終了】的一律剔除（花鋏キョウ、Kulaku Lie、宇佐美ユノ、彩雲のの均因此未入）。
  yt("tamako", "音灵魂子", "音霊魂子", "あおぎり高校", "あおぎり高校的看板娘，杂谈和游戏的节目密度都高。", "杂谈,游戏", 121, "UCt7_srJeiw55kTcK7M9ID6g", "@tamako0212"),
  yt("akari_ishikari", "石狩明里", "石狩あかり", "あおぎり高校", "あおぎり高校的元气担当，歌回和整活都在线。", "杂谈,歌,整活", 122, "UC7wZb5INldbGweowOhBIs8Q", "@akari0415"),
  yt("chiyomi", "千代浦蝶美", "千代浦蝶美", "あおぎり高校", "あおぎり高校的画师担当，绘画回和杂谈反差大。", "绘画,杂谈", 123, "UCyY6YeINiwQoA-FnmdQCkug", "@chiyomi0812"),
  yt("rieru", "我部理惠", "我部りえる", "あおぎり高校", "あおぎり高校的辣妹担当，杂谈节奏快、笑点密。", "杂谈,整活", 124, "UCFvEuP2EDkvrgJpHI6-pyNw", "@rieru0830"),
  yt("yui_hizuki", "绯月唯", "緋月ゆい", "Neo-Porte", "Neo-Porte 一期生，吸血鬼大小姐，歌杂皆强。", "歌,杂谈,游戏", 125, "UCuk7vapXKckSw6yCGGDspDg", "@Hizuki_Yui_"),
  yt("yotsuha", "天羽四叶", "天羽よつは", "Neo-Porte", "Neo-Porte 的天使担当，治愈杂谈和歌回是招牌。", "杂谈,歌,治愈", 126, "UCO2bnzPlCau6YzLoSt8EDdA", "@YotsuhaAmahane"),
  yt("teto", "心白手都", "心白てと", "Neo-Porte", "Neo-Porte 的人偶系担当，游戏和杂谈节目感强。", "游戏,杂谈", 127, "UCEtUOMEAuAMz8dor89rt2RA", "@kohakuteto_Q"),
  yt("momo_kurumizawa", "胡桃泽桃萌", "胡桃澤もも", "のりプロ", "のりプロ的治愈担当，杂谈和歌回走软萌路线。", "杂谈,歌,治愈", 128, "UCxrmkJf_X1Yhte_a4devFzA", "@kurumizawamomo"),
  yt("rose", "皇罗泽", "皇ロゼ", "Re:AcT", "Re:AcT 现役歌姬，歌回质量是社内招牌。", "歌,杂谈", 129, "UCVbRXkQP-LumaBzfw-wsrrg", "@sumeragirosech6962"),
  {
    slug: "goudan", name: "勾檀", nameAlt: "勾檀Mayumi", region: "cn", agency: "VirtuaReal",
    reason: "VirtuaReal 成员（账号签名自证），杂谈和游戏都活泼，B站约 26 万粉丝。", tags: "杂谈,游戏", sortRank: 130,
    channels: [{ platform: "bilibili", accountId: "690608693", roomId: "22778610", handle: "勾檀Mayumi", url: "https://live.bilibili.com/22778610", appUrl: "bilibili://live/22778610", followersLabel: "B站约 26 万粉丝" }],
  },
  {
    slug: "sui", name: "岁己", nameAlt: "岁己SUI", region: "cn", agency: "VirtuaReal",
    reason: "VirtuaReal 成员（账号签名自证），爱唱歌的小鸟，歌回是招牌。", tags: "歌,杂谈", sortRank: 131,
    channels: [{ platform: "bilibili", accountId: "1954091502", roomId: "25788785", handle: "岁己SUI", url: "https://live.bilibili.com/25788785", appUrl: "bilibili://live/25788785", followersLabel: "B站约 6.9 万粉丝" }],
  },  // ---- 全员对照补厚批（2026-11-09 二轮：链接审计修复 + 官方名单对照补人） ----
  // 核验方式与首版相同：逐个抓频道页，externalId / vanity handle / og:title
  // 三项与本人对上才入册；头像取自该频道 og:image 存入自有素材。
  yt("lamy", "雪花拉米", "雪花ラミィ", "hololive", "hololive 五期生 NePoLaBo，雪精灵大小姐，酒豪+治愈杂谈，粉丝口中的雪花妈妈；官方简介把 ASMR 列入她近乎每晚的夜间直播内容，会员 ASMR 也近乎每周。", "ASMR,杂谈,歌,治愈", 132, "UCFKOVgVbGmX65RxO3EtH3iw", "@YukihanaLamy"),
  yt("botan", "狮白牡丹", "獅白ぼたん", "hololive", "hololive 五期生，FPS 狮子，枪法和笑声都是招牌。", "游戏,FPS", 133, "UCUKD-uaobj9jiqB-VXt71mA", "@ShishiroBotan"),
  yt("nene", "桃铃音音", "桃鈴ねね", "hololive", "hololive 五期生，元气偶像，歌舞和整活全开。", "歌,杂谈,元气", 134, "UCAWSyEs_Io8MtpY3m-zqILA", "@MomosuzuNene"),
  yt("polka", "尾丸波尔卡", "尾丸ポルカ", "hololive", "hololive 五期生，小丑座长，杂谈爆发力社内顶级。", "杂谈,整活", 135, "UCK9V2B22uJYu3N7eR_BT9QA", "@OmaruPolka"),
  yt("flare", "不知火芙蕾雅", "不知火フレア", "hololive", "hololive 三期生，半精灵弓手，歌回和方舟系长播。", "歌,游戏", 136, "UCvInZx9h3jC2JzsIzoOebWg", "@ShiranuiFlare"),
  yt("noel", "白银诺艾尔", "白銀ノエル", "hololive", "hololive 三期生，女骑士团长，筋力自豪的治愈杂谈；有专门的 ASMR 播放列表，公开 ASMR 约每月一场，会员场另计。", "ASMR,杂谈,歌,治愈", 137, "UCdyqAaZDKHXg4Ahi7VENThQ", "@ShiroganeNoel"),
  yt("choco", "癒月巧可", "癒月ちょこ", "hololive", "hololive 二期生，魅魔护士老师，ASMR 风杂谈是招牌。", "ASMR,杂谈", 138, "UC1suqwovbL1kzsoaZgFZLKg", "@YuzukiChoco"),
  yt("aki", "亚绮·罗森塔尔", "アキ・ロゼンタール", "hololive", "hololive 一期生，异世界半精灵，歌回和啤酒杂谈。", "歌,杂谈", 139, "UCFTLzh12_nrtzqBPsTCqenA", "@AkiRosenthal"),
  yt("roboco", "萝卜子", "ロボ子さん", "hololive", "hololive 元老机器人，高性能（自称），游戏杂谈老牌。", "游戏,杂谈", 140, "UCDqI2jOz0weumE8s7paEk6g", "@Robocosan"),
  yt("azki", "AZKi", "AZKi", "hololive", "hololive 歌姬元老，虚拟歌手路线，Live 表现力极强。", "歌,音乐", 141, "UC0TXe_LYZ4scaW2XMyi5_kw", "@AZKi"),
  yt("lui", "鹰岭露依", "鷹嶺ルイ", "hololive", "holoX 女干部，冷静大姐姐，企划和杂谈的推进役。", "杂谈,游戏", 142, "UCs9_O1tRPMQTHQ-N_L6FU2g", "@TakaneLui"),
  yt("koyori", "博衣小夜璃", "博衣こより", "hololive", "holoX 研究者，粉狼助手，耐久游戏和实验企划。", "游戏,耐久", 143, "UC6eWCld0KwmyHFbAqK3V-Rw", "@HakuiKoyori"),
  yt("iroha", "风真伊吕波", "風真いろは", "hololive", "holoX 保镖武士，天然呆剑士，歌杂皆可。", "歌,杂谈,游戏", 144, "UC_vMYWcDjmfdpH6r4TTn1MQ", "@kazamairoha"),
  yt("laplus", "拉普拉斯·达克尼斯", "ラプラス・ダークネス", "hololive", "holoX 总帅，中二拉普拉斯恶魔，杂谈节目感强。", "杂谈,游戏", 145, "UCENwRMx5Yh42zWpzURebzTw", "@LaplusDarknesss"),
  yt("kanade", "音乃濑奏", "音乃瀬奏", "ReGLOSS", "ReGLOSS 音乐担当，绝对音感，歌回和即兴演奏。", "歌,音乐", 146, "UCWQtYtq9EOB4-I5P-3fh8lA", "@OtonoseKanade"),
  yt("ririka", "一条莉莉华", "一条莉々華", "ReGLOSS", "ReGLOSS 社长（自称）兼漫画家，杂谈和创作回。", "杂谈,绘画", 147, "UCtyWhCj3AqKh2dXctLkDtng", "@IchijouRirika"),
  yt("raden", "儒乌风亭螺钿", "儒烏風亭らでん", "ReGLOSS", "ReGLOSS 落语+美术馆担当，文化系杂谈独一档。", "杂谈,文化", 148, "UCdXAk5MpyLD8594lm_OvtGQ", "@JuufuuteiRaden"),
  yt("hajime", "轰一", "轟はじめ", "ReGLOSS", "ReGLOSS 舞蹈担当，前职业舞者，体力和节目密度拉满。", "舞,杂谈", 149, "UC1iA6_NT4mtAcIII6ygrvCw", "@TodorokiHajime"),
  yt("riona", "响咲莉娅娜", "響咲リオナ", "FLOW GLOW", "FLOW GLOW 队长，歌力担当，舞台气场强。", "歌,杂谈", 150, "UC9LSiN9hXI55svYEBrrK-tw", "@IsakiRiona"),
  yt("niko", "虎金妃笑虎", "虎金妃笑虎", "FLOW GLOW", "FLOW GLOW 的虎系元气担当，杂谈笑点密。", "杂谈,整活", 151, "UCuI_opAVX6qbxZY-a-AxFuQ", "@KoganeiNiko"),
  yt("su", "水宫枢", "水宮枢", "FLOW GLOW", "FLOW GLOW 的沉稳担当，歌回和游戏都稳；2026 年 2–9 月有 6 场 ASMR 标题直播，近乎每月一场。", "ASMR,歌,游戏", 152, "UCjk2nKmHzgH5Xy-C5qYRd5A", "@MizumiyaSu"),
  yt("chihaya", "轮堂千速", "輪堂千速", "FLOW GLOW", "FLOW GLOW 赛车手设定，游戏和杂谈节奏快。", "游戏,杂谈", 153, "UCKMWFR6lAstLa7Vbf5dH7ig", "@RindoChihaya"),
  yt("vivi", "绮绮罗罗薇薇", "綺々羅々ヴィヴィ", "FLOW GLOW", "FLOW GLOW 美容担当，时尚杂谈和歌回。", "杂谈,歌", 154, "UCGzTVXqMQHa4AgJVJIVvtDQ", "@KikiraraVivi"),
  yt("kokoro", "天宫心", "天宮こころ", "NIJISANJI", "彩虹社歌系代表之一，清澈歌声+天然杂谈。", "歌,杂谈", 155, "UCkIimWZ9gBJRamKF0rmPU8w", "@AmamiyaKokoro"),
  yt("ars", "阿尔斯·阿尔玛", "アルス・アルマル", "NIJISANJI", "彩虹社炼金术师，游戏耐久和独特世界观杂谈。", "游戏,杂谈", 156, "UCdpUojq0KWZCN9bxXnZwz5w", "@ArsAlmal"),
  yt("sango", "周央珊瑚", "周央サンゴ", "NIJISANJI", "彩虹社的大小姐系（自称庶民派），杂谈爆发力强。", "杂谈,游戏", 157, "UCL_O_HXgLJx3Auteer0n0pA", "@SuoSango"),
  yt("furen", "弗伦·E·露斯塔莉娅", "フレン・E・ルスタリオ", "NIJISANJI", "彩虹社女骑士，游戏和联动的人气担当。", "游戏,杂谈", 158, "UCuep1JCrMvSxOGgGhBfJuYw", "@FurenELustario"),
  yt("nazuna", "花芽荠", "花芽なずな", "VSPO!", "VSPO 花芽姐妹的妹妹，FPS 和歌回双修。", "游戏,FPS,歌", 159, "UCiMG6VdScBabPhJ1ZtaVmbw", "@nazunakaga"),
  yt("toto", "小雀户户", "小雀とと", "VSPO!", "VSPO 的小麻雀，Apex 和杂谈的黏性担当。", "游戏,FPS", 160, "UCgTzsBI0DIRopMylJEDqnog", "@totokogara"),
  yt("mimi", "兔咲深海", "兎咲ミミ", "VSPO!", "VSPO 兔系担当，游戏耐久和撒娇杂谈反差大。", "游戏,杂谈", 161, "UCnvVG9RbOW3J6Ifqo-zKLiw", "@tosakimimi3369"),
  yt("sena", "空澄赛娜", "空澄セナ", "VSPO!", "VSPO 的 FPS 强者，VALORANT 和大会常客。", "游戏,FPS", 162, "UCF_U2GCKHvDz52jWdizppIA", "@asumi_sena"),
  yt("hinano", "橘雏乃", "橘ひなの", "VSPO!", "VSPO 看板级人气，Apex 和杂谈都顶，笑声辨识度极高。", "游戏,FPS,杂谈", 163, "UCvUc0m317LWTTPZoBQV479A", "@hinanotachiba7"),
  yt("lisa", "英丽莎", "英リサ", "VSPO!", "VSPO 的大小姐担当，游戏和歌杂均衡。", "游戏,杂谈", 164, "UCurEA8YoqFwimJcAuSHU0MQ", "@lisahanabusa"),
  {
    slug: "ren", name: "如月怜", nameAlt: "如月れん", region: "jp", agency: "VSPO!",
    reason: "VSPO 的沉稳担当，FPS 和治愈杂谈；大会联动常在 Twitch（ren_kisaragi__）开播。", tags: "游戏,FPS", sortRank: 165,
    channels: [
      { platform: "youtube", accountId: "UCGWa1dMU_sDCaRQjdabsVgg", handle: "@ren_kisaragi__", url: "https://www.youtube.com/@ren_kisaragi__", appUrl: "youtube://www.youtube.com/@ren_kisaragi__" },
      { platform: "twitch", accountId: "ren_kisaragi__", handle: "ren_kisaragi__", url: "https://www.twitch.tv/ren_kisaragi__", appUrl: "twitch://stream/ren_kisaragi__" },
    ],
  },
  yt("qpi", "神成丘比", "神成きゅぴ", "VSPO!", "VSPO 的电波系担当，游戏和整活节目感强。", "游戏,整活", 166, "UCMp55EbT_ZlqiMS3lCj01BQ", "@KaminariQpi"),
  yt("tsuna", "猫汰月", "猫汰つな", "VSPO!", "VSPO 猫系人气担当，歌回和游戏都在线。", "歌,游戏", 167, "UCIjdfjcSaEgdjwbgjxC3ZWg", "@tsuna_nekota"),
  {
    slug: "ramune", name: "白波来梦", nameAlt: "白波らむね", region: "jp", agency: "VSPO!",
    reason: "VSPO 的治愈担当，杂谈和游戏走软萌路线；另有 Twitch（ramuneshiranami）阵地。", tags: "杂谈,游戏,治愈", sortRank: 168,
    channels: [
      { platform: "youtube", accountId: "UC61OwuYOVuKkpKnid-43Twg", handle: "@shiranamiramune", url: "https://www.youtube.com/@shiranamiramune", appUrl: "youtube://www.youtube.com/@shiranamiramune" },
      { platform: "twitch", accountId: "ramuneshiranami", handle: "ramuneshiranami", url: "https://www.twitch.tv/ramuneshiranami", appUrl: "twitch://stream/ramuneshiranami" },
    ],
  },
  yt("met", "小森美特", "小森めと", "VSPO!", "VSPO 的梗王之一，杂谈和联动节目密度高。", "杂谈,游戏", 169, "UCzUNASdzI4PV5SlqtYwAkKQ", "@Met_Komori"),
  yt("akari_yumeno", "梦野阿卡里", "夢野あかり", "VSPO!", "VSPO 的梦系担当，歌回和游戏兼备。", "歌,游戏", 170, "UCS5l_Y0oMVTjEos2LuyeSZQ", "@akarindao"),
  yt("kuromu", "夜乃黑梦", "夜乃くろむ", "VSPO!", "VSPO 新生代，游戏和杂谈的爆发力选手。", "游戏,杂谈", 171, "UCX4WL24YEOUYd7qDsFSLDOw", "@YanoKuromu"),
  yt("kokage", "纺木小影", "紡木こかげ", "VSPO!", "VSPO 的治愈系担当，杂谈和歌回走温暖路线。", "杂谈,歌,治愈", 172, "UC-WX1CXssCtCtc2TNIRnJzg", "@Kokage_Tsumugi"),
  yt("yuuhi", "千灯夕日", "千燈ゆうひ", "VSPO!", "VSPO 的沉稳担当，游戏和杂谈节目感强。", "游戏,杂谈", 173, "UCuDY3ibSP2MFRgf7eo3cojg", "@SendoYuuhi"),
  yt("hanabi", "蝶屋花火", "蝶屋はなび", "VSPO!", "VSPO 的蝴蝶担当，歌回和游戏都亮眼。", "歌,游戏", 174, "UCL9hJsdk9eQa0IlWbFB2oRg", "@HanabiChoya"),
  yt("moka", "甘结摩卡", "甘結もか", "VSPO!", "VSPO 的甜系担当，杂谈和游戏走治愈路线。", "杂谈,游戏,治愈", 175, "UC8vKBjGY2HVfbW9GAmgikWw", "@Moka_Amayui"),
  yt("siro", "电脑少女小白", "電脳少女シロ", ".LIVE", ".LIVE 元老，电竞脑少女，游戏和企划的老牌人气。", "游戏,杂谈", 176, "UCGn883akidjMlDY8khW1zGg", "@Siro_ch"),
  yt("chieri", "花京院千绘里", "花京院ちえり", ".LIVE", ".LIVE 大小姐担当，歌回和杂谈都稳。", "歌,杂谈", 177, "UCP9ZgeIJ3Ri9En69R0kJc9Q", "@ChieriKakyoin"),
  yt("suzu", "神乐铃", "神楽すず", ".LIVE", ".LIVE 的巫女担当，治愈杂谈和歌回。", "杂谈,歌,治愈", 178, "UCCX5CPmImziq5ZGz7_BREFw", "@kagurasuzu"),
  yt("tomari", "兔鞠玛丽", "兎鞠まり", "个人势", "个人势代表，画师出身的兔耳娘，杂谈和绘画回人气长青。", "杂谈,绘画", 179, "UC_B8sJWsXCVxxc3E-GbFZKA", "@TomariMari"),
  yt("hinata", "猫宫日向", "猫宮ひなた", "个人势", "个人势猫系代表，FPS 和杂谈的老牌人气。", "游戏,FPS,杂谈", 180, "UCevD0wKzJFpfIkvHOiQsfLQ", "@NekomiyaHinata"),
  {
    slug: "fuwamoco", name: "Fuwawa & Mococo Abyssgard", nameAlt: "FUWAMOCO", region: "en", agency: "hololive EN",
    reason: "Advent 的双子魔界犬姐妹，共享一个频道，游戏和联动节目效果拉满。", tags: "游戏,杂谈", sortRank: 181,
    channels: [{ platform: "youtube", accountId: "UCt9H_RpQzhxzlyBxFqrdHqA", handle: "@FUWAMOCOch", url: "https://www.youtube.com/@FUWAMOCOch", appUrl: "youtube://www.youtube.com/@FUWAMOCOch" }],
  },
  {
    slug: "risu", name: "Ayunda Risu", nameAlt: "アユンダ・リス", region: "en", agency: "hololive ID",
    reason: "hololive ID 一期生，松鼠娘，歌回和整活杂谈。", tags: "歌,杂谈", sortRank: 182,
    channels: [{ platform: "youtube", accountId: "UCOyYb1c43VlX9rc_lT6NKQw", handle: "@ayundarisu", url: "https://www.youtube.com/@ayundarisu", appUrl: "youtube://www.youtube.com/@ayundarisu" }],
  },
  {
    slug: "moona", name: "Moona Hoshinova", nameAlt: "ムーナ・ホシノヴァ", region: "en", agency: "hololive ID",
    reason: "ID 一期生，月之女神，歌力和建筑游戏回。", tags: "歌,游戏", sortRank: 183,
    channels: [{ platform: "youtube", accountId: "UCP0BspO_AMEe3aQqqpo89Dg", handle: "@MoonaHoshinova", url: "https://www.youtube.com/@MoonaHoshinova", appUrl: "youtube://www.youtube.com/@MoonaHoshinova" }],
  },
  {
    slug: "iofi", name: "Airani Iofifteen", nameAlt: "アイラニ・イオフィフティーン", region: "en", agency: "hololive ID",
    reason: "ID 一期生，外星画师，绘画回和多语言杂谈。", tags: "绘画,杂谈", sortRank: 184,
    channels: [{ platform: "youtube", accountId: "UCAoy6rzhSf4ydcYjJw3WoVg", handle: "@AiraniIofifteen", url: "https://www.youtube.com/@AiraniIofifteen", appUrl: "youtube://www.youtube.com/@AiraniIofifteen" }],
  },
  {
    slug: "ollie", name: "Kureiji Ollie", nameAlt: "クレイジー・オリー", region: "en", agency: "hololive ID",
    reason: "ID 二期生，僵尸偶像，高能量杂谈和联动发动机。", tags: "杂谈,整活", sortRank: 185,
    channels: [{ platform: "youtube", accountId: "UCYz_5n-uDuChHtLo7My1HnQ", handle: "@KureijiOllie", url: "https://www.youtube.com/@KureijiOllie", appUrl: "youtube://www.youtube.com/@KureijiOllie" }],
  },
  {
    slug: "anya", name: "Anya Melfissa", nameAlt: "アーニャ・メルフィッサ", region: "en", agency: "hololive ID",
    reason: "ID 二期生，古代短剑娘，沉稳游戏和治愈杂谈。", tags: "游戏,杂谈", sortRank: 186,
    channels: [{ platform: "youtube", accountId: "UC727SQYUvx5pDDGQpTICNWg", handle: "@AnyaMelfissa", url: "https://www.youtube.com/@AnyaMelfissa", appUrl: "youtube://www.youtube.com/@AnyaMelfissa" }],
  },
  {
    slug: "reine", name: "Pavolia Reine", nameAlt: "パヴォリア・レイネ", region: "en", agency: "hololive ID",
    reason: "ID 二期生，孔雀贵族，歌回和语言学杂谈。", tags: "歌,杂谈", sortRank: 187,
    channels: [{ platform: "youtube", accountId: "UChgTyjG-pdNvxxhdsXfHQ5Q", handle: "@PavoliaReine", url: "https://www.youtube.com/@PavoliaReine", appUrl: "youtube://www.youtube.com/@PavoliaReine" }],
  },
  {
    slug: "zeta", name: "Vestia Zeta", nameAlt: "ベスティア・ゼータ", region: "en", agency: "hololive ID",
    reason: "ID 三期生，秘密组织特工（猫），游戏和杂谈反差萌。", tags: "游戏,杂谈", sortRank: 188,
    channels: [{ platform: "youtube", accountId: "UCTvHWSfBZgtxE4sILOaurIQ", handle: "@VestiaZeta", url: "https://www.youtube.com/@VestiaZeta", appUrl: "youtube://www.youtube.com/@VestiaZeta" }],
  },
  {
    slug: "kaela", name: "Kaela Kovalskia", nameAlt: "カエラ・コヴァルスキア", region: "en", agency: "hololive ID",
    reason: "ID 三期生，铁匠娘，耐久肝帝，游戏长播代表。", tags: "游戏,耐久", sortRank: 189,
    channels: [{ platform: "youtube", accountId: "UCZLZ8Jjx_RN2CXloOmgTHVg", handle: "@KaelaKovalskia", url: "https://www.youtube.com/@KaelaKovalskia", appUrl: "youtube://www.youtube.com/@KaelaKovalskia" }],
  },
  {
    slug: "kobo", name: "Kobo Kanaeru", nameAlt: "こぼ・かなえる", region: "en", agency: "hololive ID",
    reason: "ID 三期生，雨之巫女，ID 人气顶流，歌杂皆强。", tags: "歌,杂谈,游戏", sortRank: 190,
    channels: [{ platform: "youtube", accountId: "UCjLEmnpCNeisMxy134KPwWw", handle: "@KoboKanaeru", url: "https://www.youtube.com/@KoboKanaeru", appUrl: "youtube://www.youtube.com/@KoboKanaeru" }],
  },
  {
    slug: "elira", name: "Elira Pendora", nameAlt: "エリーラ・ペンドラ", region: "en", agency: "NIJISANJI EN",
    reason: "EN 一期生太阳龙，歌回和杂谈的门面担当。", tags: "歌,杂谈", sortRank: 191,
    channels: [{ platform: "youtube", accountId: "UCIeSUTOTkF9Hs7q3SGcO-Ow", handle: "@EliraPendora", url: "https://www.youtube.com/@EliraPendora", appUrl: "youtube://www.youtube.com/@EliraPendora" }],
  },
  {
    slug: "petra", name: "Petra Gurin", nameAlt: "ペトラ・グリン", region: "en", agency: "NIJISANJI EN",
    reason: "EN 一期生企鹅，治愈杂谈和歌回。", tags: "杂谈,歌,治愈", sortRank: 192,
    channels: [{ platform: "youtube", accountId: "UCgA2jKRkqpY_8eysPUs8sjw", handle: "@petragurin", url: "https://www.youtube.com/@petragurin", appUrl: "youtube://www.youtube.com/@petragurin" }],
  },
  {
    slug: "reimu", name: "Reimu Endou", nameAlt: "遠藤霊夢", region: "en", agency: "NIJISANJI EN",
    reason: "EN 一期生幽灵，恐怖游戏和歌回。", tags: "游戏,恐怖,歌", sortRank: 193,
    channels: [{ platform: "youtube", accountId: "UCBURM8S4LH7cRZ0Clea9RDA", handle: "@ReimuEndou", url: "https://www.youtube.com/@ReimuEndou", appUrl: "youtube://www.youtube.com/@ReimuEndou" }],
  },
  {
    slug: "scarle", name: "Scarle Yonaguni", nameAlt: "スカーレ・ヨナグニ", region: "en", agency: "NIJISANJI EN",
    reason: "EN 二期生魔女，ASMR 和杂谈的人气担当。", tags: "ASMR,杂谈", sortRank: 194,
    channels: [{ platform: "youtube", accountId: "UCFgXWZOUZA2oYHNr6qDmsTQ", handle: "@ScarleYonaguni", url: "https://www.youtube.com/@ScarleYonaguni", appUrl: "youtube://www.youtube.com/@ScarleYonaguni" }],
  },
  {
    slug: "meloco", name: "Meloco Kyoran", nameAlt: "狂蘭メロコ", region: "en", agency: "NIJISANJI EN",
    reason: "EN 二期生驱魔师，KU100 ASMR 存档是她频道的主力内容之一，歌回和多语言杂谈也稳。", tags: "ASMR,歌,杂谈", sortRank: 195,
    channels: [{ platform: "youtube", accountId: "UChKXd7oqD18qiIYBoRIHTlw", handle: "@MelocoKyoran", url: "https://www.youtube.com/@MelocoKyoran", appUrl: "youtube://www.youtube.com/@MelocoKyoran" }],
  },
  {
    slug: "remia", name: "Remia Aotsuki", nameAlt: "青月レミア", region: "en", agency: "VSPO! EN",
    reason: "VSPO EN 一期生，歌回和 FPS 兼备。", tags: "歌,游戏", sortRank: 196,
    channels: [{ platform: "youtube", accountId: "UCCra1t-eIlO3ULyXQQMD9Xw", handle: "@RemiaAotsuki", url: "https://www.youtube.com/@RemiaAotsuki", appUrl: "youtube://www.youtube.com/@RemiaAotsuki" }],
  },
  {
    slug: "arya", name: "Arya Kuroha", nameAlt: "黒刃アリヤ", region: "en", agency: "VSPO! EN",
    reason: "VSPO EN 的刀系担当，游戏和杂谈节目感强。", tags: "游戏,杂谈", sortRank: 197,
    channels: [{ platform: "youtube", accountId: "UCLlJpxXt6L5d-XQ0cDdIyDQ", handle: "@AryaKuroha", url: "https://www.youtube.com/@AryaKuroha", appUrl: "youtube://www.youtube.com/@AryaKuroha" }],
  },
  {
    slug: "jira", name: "Jira Jisaki", nameAlt: "地崎ジラ", region: "en", agency: "VSPO! EN",
    reason: "VSPO EN 担当，游戏耐久和杂谈。", tags: "游戏,杂谈", sortRank: 198,
    channels: [{ platform: "youtube", accountId: "UCeCWj-SiJG9SWN6wGORiLmw", handle: "@jirajisaki", url: "https://www.youtube.com/@jirajisaki", appUrl: "youtube://www.youtube.com/@jirajisaki" }],
  },
  {
    slug: "narin", name: "Narin Mikure", nameAlt: "美暮ナリン", region: "en", agency: "VSPO! EN",
    reason: "VSPO EN 的治愈担当，杂谈和歌回。", tags: "杂谈,歌", sortRank: 199,
    channels: [{ platform: "youtube", accountId: "UCKSpM183c85d5V2cW5qaUjA", handle: "@narinmikure", url: "https://www.youtube.com/@narinmikure", appUrl: "youtube://www.youtube.com/@narinmikure" }],
  },
  {
    slug: "riko", name: "Riko Solari", nameAlt: "ソラリリコ", region: "en", agency: "VSPO! EN",
    reason: "VSPO EN 的太阳系担当，元气杂谈和游戏。", tags: "杂谈,游戏", sortRank: 200,
    channels: [{ platform: "youtube", accountId: "UC7Xglp1fske9zmRe7Oj8YyA", handle: "@rikosolari", url: "https://www.youtube.com/@rikosolari", appUrl: "youtube://www.youtube.com/@rikosolari" }],
  },
  {
    slug: "eris", name: "Eris Suzukami", nameAlt: "涼上エリス", region: "en", agency: "VSPO! EN",
    reason: "VSPO EN 担当，游戏和杂谈均衡。", tags: "游戏,杂谈", sortRank: 201,
    channels: [{ platform: "youtube", accountId: "UCp_3ej2br9l9L1DSoHVDZGw", handle: "@erissuzukami", url: "https://www.youtube.com/@erissuzukami", appUrl: "youtube://www.youtube.com/@erissuzukami" }],
  },
  {
    slug: "juno", name: "Juno Umezono", nameAlt: "梅園ジュノ", region: "en", agency: "VSPO! EN",
    reason: "VSPO EN 担当，歌回和游戏兼备。", tags: "歌,游戏", sortRank: 202,
    channels: [{ platform: "youtube", accountId: "UCRJV_1aV4aZjFAEUn6o5arw", handle: "@JunoUmezono", url: "https://www.youtube.com/@JunoUmezono", appUrl: "youtube://www.youtube.com/@JunoUmezono" }],
  },
  {
    slug: "saine", name: "Ginjo Saine", nameAlt: "銀城サイネ", region: "en", agency: "VSPO! EN",
    reason: "VSPO EN 的银城担当，杂谈和游戏节目感强。", tags: "杂谈,游戏", sortRank: 203,
    channels: [{ platform: "youtube", accountId: "UC2xXx1m1jeL0W84_0jTg-Yw", handle: "@Saine_Ginjo", url: "https://www.youtube.com/@Saine_Ginjo", appUrl: "youtube://www.youtube.com/@Saine_Ginjo" }],
  },
  {
    slug: "chise", name: "Tatsumaki Chise", nameAlt: "龍巻ちせ", region: "en", agency: "VSPO! EN",
    reason: "VSPO EN 的龙卷担当，游戏和整活。", tags: "游戏,整活", sortRank: 204,
    channels: [{ platform: "youtube", accountId: "UCoW8qQy80mKH0RJTKAK-nNA", handle: "@Chise_Tatsumaki", url: "https://www.youtube.com/@Chise_Tatsumaki", appUrl: "youtube://www.youtube.com/@Chise_Tatsumaki" }],
  },
  {
    slug: "panko", name: "Komachi Panko", nameAlt: "小町ぱんこ", region: "en", agency: "Phase Connect",
    reason: "Phase 的浣熊（自称熊猫）担当，整活杂谈和游戏。", tags: "整活,杂谈", sortRank: 205,
    channels: [{ platform: "youtube", accountId: "UCVo_KgPNsDKxHwzib7uarCw", handle: "@komachipanko", url: "https://www.youtube.com/@komachipanko", appUrl: "youtube://www.youtube.com/@komachipanko" }],
  },
  {
    slug: "airi", name: "Chisaka Airi", nameAlt: "千坂アイリ", region: "en", agency: "Phase Connect",
    reason: "Phase 的狼娘担当，游戏和歌回都认真。", tags: "游戏,歌", sortRank: 206,
    channels: [{ platform: "youtube", accountId: "UC5qlAhrec6-0J-K3zmhNPPQ", handle: "@ChisakaAiri", url: "https://www.youtube.com/@ChisakaAiri", appUrl: "youtube://www.youtube.com/@ChisakaAiri" }],
  },
  {
    slug: "jelly", name: "Jelly Hoshiumi", nameAlt: "星海ジェリー", region: "en", agency: "Phase Connect",
    reason: "Phase 的水母担当，治愈杂谈和游戏。", tags: "杂谈,游戏,治愈", sortRank: 207,
    channels: [{ platform: "youtube", accountId: "UCkb-r702uhx4-6Lrmetp-Ow", handle: "@JellyHoshiumi", url: "https://www.youtube.com/@JellyHoshiumi", appUrl: "youtube://www.youtube.com/@JellyHoshiumi" }],
  },
  {
    slug: "dizzy", name: "Dizzy Dokuro", nameAlt: "髑髏ディズィー", region: "en", agency: "Phase Connect",
    reason: "Phase 的暗黑系担当，独特世界观杂谈。", tags: "杂谈,整活", sortRank: 208,
    channels: [{ platform: "youtube", accountId: "UC98iRMvRqUxRD6GP4NtRskw", handle: "@dizzydokuro", url: "https://www.youtube.com/@dizzydokuro", appUrl: "youtube://www.youtube.com/@dizzydokuro" }],
  },
  {
    slug: "abi", name: "Abi Kadabra", nameAlt: "アビ・カダブラ", region: "en", agency: "V4Mirai",
    reason: "V4Mirai 的魔术师担当，游戏和杂谈节目感强。", tags: "游戏,杂谈", sortRank: 209,
    channels: [{ platform: "youtube", accountId: "UCXxgGn6klyuRga9tTeJa6EA", handle: "@abikadabra", url: "https://www.youtube.com/@abikadabra", appUrl: "youtube://www.youtube.com/@abikadabra" }],
  },
  {
    slug: "yuko", name: "Yuko Yurei", nameAlt: "幽霊ゆこ", region: "en", agency: "idol",
    reason: "idol EN 的幽灵担当，恐怖游戏和歌回。", tags: "游戏,恐怖,歌", sortRank: 210,
    channels: [{ platform: "youtube", accountId: "UCcIcMRVpNqWQn4WnDhRASAw", handle: "@yukoyurei", url: "https://www.youtube.com/@yukoyurei", appUrl: "youtube://www.youtube.com/@yukoyurei" }],
  },
  {
    slug: "juna", name: "Juna Unagi", nameAlt: "ジュナ・ウナギ", region: "en", agency: "idol",
    reason: "idol EN 的鳗鱼担当，杂谈和游戏。", tags: "杂谈,游戏", sortRank: 211,
    channels: [{ platform: "youtube", accountId: "UCTFCSCPvqjXEs3zq91aeOVg", handle: "@JunaUnagi", url: "https://www.youtube.com/@JunaUnagi", appUrl: "youtube://www.youtube.com/@JunaUnagi" }],
  },
  {
    slug: "nimi", name: "Nimi Nightmare", nameAlt: "ニミ・ナイトメア", region: "en", agency: "个人势",
    reason: "英圈个人势新星，治愈杂谈和游戏回人气急升。", tags: "杂谈,游戏,治愈", sortRank: 212,
    channels: [{ platform: "youtube", accountId: "UCIfAvpeIWGHb0duCkMkmm2Q", handle: "@niminightmare", url: "https://www.youtube.com/@niminightmare", appUrl: "youtube://www.youtube.com/@niminightmare" }],
  },
  {
    slug: "henya", name: "Henya the Genius", nameAlt: "ヘニャ・ザ・ジーニアス", region: "en", agency: "VShojo",
    reason: "VShojo 的天才（自称）猫娘，Twitch 为主，游戏整活和杂谈。", tags: "杂谈,游戏,整活", sortRank: 213,
    channels: [
      { platform: "twitch", accountId: "henyathegenius", handle: "henyathegenius", url: "https://www.twitch.tv/henyathegenius", appUrl: "twitch://stream/henyathegenius" },
      { platform: "youtube", accountId: "UCVhRMzNWYcg8XDTgB9NFRTw", handle: "@henyathegenius", url: "https://www.youtube.com/@henyathegenius", appUrl: "youtube://www.youtube.com/@henyathegenius" },
    ],
  },
  {
    slug: "haruka", name: "Haruka Karibu", nameAlt: "ハルカ・カリブ", region: "en", agency: "VShojo",
    reason: "VShojo 的驯鹿娘，Twitch 为主，治愈杂谈和游戏。", tags: "杂谈,游戏,治愈", sortRank: 214,
    channels: [
      { platform: "twitch", accountId: "harukakaribu", handle: "harukakaribu", url: "https://www.twitch.tv/harukakaribu", appUrl: "twitch://stream/harukakaribu" },
      { platform: "youtube", accountId: "UCsk_mKQyv_xdhahUBqoVhcg", handle: "@HarukaKaribu", url: "https://www.youtube.com/@HarukaKaribu", appUrl: "youtube://www.youtube.com/@HarukaKaribu" },
    ],
  },
  {
    slug: "kson", name: "Kson", nameAlt: "kson総長", region: "en", agency: "VShojo",
    reason: "VShojo 的总长，YouTube / Twitch 双栖，游戏和杂谈的老牌人气。", tags: "游戏,杂谈", sortRank: 215,
    channels: [
      { platform: "youtube", accountId: "UC9ruVYPv7yJmV0Rh0NKA-Lw", handle: "@ksonONAIR", url: "https://www.youtube.com/@ksonONAIR", appUrl: "youtube://www.youtube.com/@ksonONAIR" },
      { platform: "twitch", accountId: "ksonsouchou", handle: "ksonsouchou", url: "https://www.twitch.tv/ksonsouchou", appUrl: "twitch://stream/ksonsouchou" },
    ],
  },
  {
    slug: "dooby", name: "Dooby", nameAlt: "ドゥービー", region: "en", agency: "个人势",
    reason: "个人势新星，火车娘设定，歌杂皆强、出道即爆红。", tags: "歌,杂谈,游戏", sortRank: 216,
    channels: [
      { platform: "youtube", accountId: "UC6T7TJZbW6nO-qsc5coo8Pg", handle: "@dooby3d", url: "https://www.youtube.com/@dooby3d", appUrl: "youtube://www.youtube.com/@dooby3d" },
      { platform: "twitch", accountId: "dooby3d", handle: "dooby3d", url: "https://www.twitch.tv/dooby3d", appUrl: "twitch://stream/dooby3d" },
    ],
  },
  {
    slug: "camila", name: "Camila", nameAlt: "カミラ", region: "en", agency: "个人势",
    reason: "个人势蝙蝠魅魔担当，Twitch 为主，杂谈和联动人气高。", tags: "杂谈,游戏", sortRank: 217,
    channels: [{ platform: "twitch", accountId: "camila", handle: "camila", url: "https://www.twitch.tv/camila", appUrl: "twitch://stream/camila" }],
  },
  {
    slug: "filian", name: "Filian", nameAlt: "フィリアン", region: "en", agency: "Mythic Talent",
    reason: "Mythic Talent 的翻滚系代表，Twitch 头部，VRChat 和整活节目密度极高。", tags: "整活,游戏", sortRank: 218,
    channels: [{ platform: "twitch", accountId: "filian", handle: "filian", url: "https://www.twitch.tv/filian", appUrl: "twitch://stream/filian" }],
  },
  {
    slug: "wumi", name: "呜米", nameAlt: "呜米", region: "cn", agency: "个人势",
    reason: "B站个人势头部，虚拟歌姬出身，歌回和直播都稳。", tags: "歌,杂谈", sortRank: 219,
    channels: [{ platform: "bilibili", accountId: "617459493", roomId: "22384516", handle: "呜米", url: "https://live.bilibili.com/22384516", appUrl: "bilibili://live/22384516", followersLabel: "B站约 98 万粉丝" }],
  },
  // ---- 用户点名追加（2026-11-10：桃井月月nya，用户给短链 b23.tv/rkRbvOD） ----
  // 核验：短链 302 落点 space.bilibili.com/1483275423；card 接口回读账号名
  // 「桃井月月nya」与用户给的名称一致、官方认证「bilibili直播高能主播」、
  // 签名「一般路过小猫咪」（猫系人设）；getRoomInfoOld 按同一 mid 回房间号
  // 32472486、房间标题「gamegame小猫~」，UID 与房间号同属一人。萌娘百科
  // 对照：个人势、游戏区、以《决战平安京》为主、已复活恢复活动。头像取
  // card 接口的官方 face 存入自有素材并看图确认（粉发猫系、抱猫）。
  // YouTube / Twitch 阵地未核实到，只加 B站。
  // ASMR 常驻补标（2026-11-12，用户点名「桃井月月是asmr主播」后亲查取证，
  // 逐条证据见 DATA-PLAN.md「2026-11-12 桃井月月 ASMR 常驻核验」一节）：
  // 其 B站投稿主力就是两大 ASMR 系列——【ASMR/无损Hires】与【月月の
  // ASMR】（掏耳/采耳/吐息/呼呼助眠），自 2025-07 持续更新至 2026-11-10，
  // 最近 50 条投稿中 38 条以上标题直接带 ASMR 系列标记。故 tags 首位加
  // ASMR；原游戏记录（决战平安京等）保留——常驻标签与场次判定互不污染，
  // 她打游戏的那场仍按游戏识别、播 ASMR 的那场走场次级 ASMR 判定。
  {
    slug: "yueyue", name: "桃井月月", nameAlt: "桃井月月nya", region: "cn", agency: "个人势",
    reason: "B站个人势猫系虚拟UP主，签名是「一般路过小猫咪」；游戏区出身、以《决战平安京》为主，同时是 ASMR 常驻：投稿主力为【ASMR/无损Hires】与【月月のASMR】两大系列（掏耳、吐息、呼呼助眠，如 2026-11-10《黑洞+抚摸+气息》、2026-10-31《耳腔清洁计划》），2025-07 至今持续更新；停播后已复活恢复活动。", tags: "ASMR,游戏,决战平安京,猫", sortRank: 220,
    channels: [{ platform: "bilibili", accountId: "1483275423", roomId: "32472486", handle: "桃井月月nya", url: "https://live.bilibili.com/32472486", appUrl: "bilibili://live/32472486", followersLabel: "B站约 3.3 万粉丝" }],
  },
  // ---- ASMR 锐评名单追加（2026-11-10：B站视频《从夯到拉锐评大量日系
  // ASMR 助眠主播》参演名单，用户要求逐人核对后再加） ----
  // 逐人核验记录见 DATA-PLAN.md「2026-11-10 ASMR 名单核验」一节：
  // 频道 ID/handle 均以官方频道页回读为准，活动状态以频道页 /streams
  // 与 /videos 的最新条目时间为准（核验日 2026-11-10）。名单中苺氷えな
  // （ena）、周防パトラ（patra）已在册且 ASMR 标记在，未重复添加；
  // 色恋まくら（2025-10-31 毕业）、みもりあいの（主场移至 niconico、
  // 本台不支持）、癒音くるみ（复归一次后再次停滞）、初恋ひめか（官方
  // 链接频道已 404、无法核实现行频道）四人未加，原因逐人记在案。
  yt("koito", "恋音りゆ", "Koito Riyu", "个人势", "个人势 ASMR 配信者，黒3dio/KU100 耳かき与囁き为招牌，2026-10 仍高频深夜开播。", "ASMR,耳かき,囁き", 221, "UCdt2Rlb0f__IQ1ii-UsVXxg", "@koitoriyu"),
  yt("miel", "ミエル", "Miel", "个人势", "ASMR 专门配信者，直播主场在 TwitCasting，YouTube 官方频道同步投稿 KU100 ASMR 存档，2026-11 仍有新投稿。", "ASMR,睡眠导入,KU100", 222, "UCIpURfedP3QmCgS2C8Zdk1w", "@miel_ii"),
  yt("hiiro", "天結ひいろ", "Amayui Hiiro", "Link Studio", "Link Studio 所属，每周三固定 ASMR 配信，2026-11 仍在播。", "ASMR,睡眠导入", 223, "UCYWrONyPfUmigUbjZn3QmBg", "@amayuihiiro"),
  yt("macoto", "Macoto", "まこと。", "个人势", "2012 年开始 ASMR 放送的先驱，KU100 睡眠导入的代表人物，频道约 72 万订阅，2026-09 有新 ASMR 直播。", "ASMR,KU100,睡眠导入", 224, "UCwSOARsvB-Qa6PtuYyK74dA", "@rnqqU"),
  yt("kibana", "鬼花まりす", "Kibana Malice", "个人势", "Macoto 担任制作人的 ASMR 专门 VTuber，耳かき耐久与密着囁き为招牌，2026-11 仍在播。", "ASMR,耳かき,囁き", 225, "UCfYJ-ioTfZUhY59yBgojdTQ", "@Malicech.鬼花まりすASMR"),
  yt("tenshi", "天使なの", "Tenshi Nano", "个人势", "原 ますかれーど所属、现个人势；KU100/黒3dio ASMR 为本行，休止后于 2026-10 在现频道复归并表明继续活动。", "ASMR,KU100,囁き", 226, "UClJ31brP21vL1Pu499U4LDQ", "@angelnanox"),
  yt("chocolat", "ココ・ショコラ", "ここ・しょこら", "个人势", "情景语音与 ASMR 系 VTuber；现频道名为「Chocolate Ch.ここ・しょこら」，2026-10 旧名义「最后的配信」后仍在同一频道继续配信与投稿。", "ASMR,情景语音,歌", 227, "UC_dViuf0E84OZz2n6JzSovA", "@C-Chocolat0707"),
  yt("mochizuki", "餅月なこ", "Mochizuki Naco", "个人势", "个人势，频道约 32 万订阅，每周四、日固定 KU100 ASMR 配信，2026-11 仍在播。", "ASMR,KU100,睡眠导入", 228, "UCzqQYhCoGsQhzUjtFjppW1Q", "@naco_mochizuki"),
  yt("kohaku", "琥珀ねね", "Kohaku Nene", "个人势", "雪豹系 VTuber，个人势（La Peche Party 成员），KU100 睡眠导入 ASMR，频率不高但持续在播，2026-10 有新 ASMR 配信。", "ASMR,KU100,睡眠导入", 229, "UC3uoOH4N2F4T9FyAGDwM6Ow", "@kohakunene"),
  yt("reikira", "れいきら", "Reikira", "个人势", "个人势，耳舐め ASMR 专门；旧 10 万订阅频道消失后多次重建，现行主频道仍在投稿与配信（另有投稿频道 @O7O7ASMRkira 未收录）。", "ASMR,耳舐め,KU100", 230, "UCgT_686ndokzUj7Ra56g6OQ", "@vtuber1224"),
  yt("emmamarr", "EmmaMarr", "EmmaMarr", "个人势", "日本 ASMR VTuber，投稿型为主，耳かき与耳はむ ASMR 持续更新，2026-11 有新作。", "ASMR,耳かき", 231, "UCc01DNoHeMy2kK9gNIhl4fw", "@EmmaMarr"),
  yt("sakurane", "桜音エリカ", "Sakurane Elika", "个人势", "ASMR 配信者，耳ふぅ与囁き为招牌，2026-11 仍高频开播；另有 Twitch 账号以游戏为主，未收录。", "ASMR,囁き,耳ふぅ", 232, "UCZ3pa-Ps7K_sh1ejEFxTzHg", "@SakuraneELika"),
  {
    slug: "suzuki", name: "鈴木ゆら", nameAlt: "Suzuki Yura", region: "jp", agency: "アオハライブ",
    reason: "アオハライブ所属的 ASMR 担当，KU100 耳責め为招牌；YouTube 与 Twitch 双栖，2026-11 在 Twitch 几乎每日 ASMR 开播。", tags: "ASMR,KU100,游戏", sortRank: 233,
    channels: [
      { platform: "youtube", accountId: "UCRs6zMzOcSNAqOLTpW-c3-A", handle: "@鈴木ゆらASMR", url: "https://www.youtube.com/@鈴木ゆらASMR", appUrl: "youtube://www.youtube.com/@鈴木ゆらASMR" },
      { platform: "twitch", accountId: "suzukiyura", handle: "suzukiyura", url: "https://www.twitch.tv/suzukiyura", appUrl: "twitch://stream/suzukiyura" },
    ],
  },
  {
    slug: "yamada", name: "山田めい", nameAlt: "Yamada Mei", region: "jp", agency: "アオハライブ",
    reason: "アオハライブ所属，Twitch 为主场（近 30 天约 110 小时、几乎每日 ASMR 配信），YouTube 频道「山田が通る」同步活动。", tags: "ASMR,耳舐め,歌", sortRank: 234,
    channels: [
      { platform: "youtube", accountId: "UCPqEyPI4OjrCAcjwoYg42vA", handle: "@山田が通る", url: "https://www.youtube.com/@山田が通る", appUrl: "youtube://www.youtube.com/@山田が通る" },
      { platform: "twitch", accountId: "yamadamei_", handle: "yamadamei_", url: "https://www.twitch.tv/yamadamei_", appUrl: "twitch://stream/yamadamei_" },
    ],
  },
  yt("usui", "碓氷らむね", "Usui Ramune", "个人势", "个人势，KU100 囁き ASMR 配信者，现行频道 @usirmn.1 于 2026-11 仍在播。", "ASMR,囁き,KU100", 235, "UCfbJOFsTqlrSU3Tpc2qWjKw", "@usirmn.1"),
  {
    slug: "meruku", name: "鈴白めるく", nameAlt: "Suzushiro Meruku", region: "jp", agency: "个人势",
    reason: "个人势，黒3dio 睡眠导入 ASMR；YouTube（周日/三）与 Twitch（周一/五）均有固定档期，2026-11 仍在播。", tags: "ASMR,黒3dio,睡眠导入", sortRank: 236,
    channels: [
      { platform: "youtube", accountId: "UCDMOqUDToVDwxq6cN27spVw", handle: "@鈴白めるく", url: "https://www.youtube.com/@鈴白めるく", appUrl: "youtube://www.youtube.com/@鈴白めるく" },
      { platform: "twitch", accountId: "suzusiromeruku", handle: "suzusiromeruku", url: "https://www.twitch.tv/suzusiromeruku", appUrl: "twitch://stream/suzusiromeruku" },
    ],
  },
  yt("kimitsu", "木蜜甜花", "Kimitsu Tenka", "めいどるーちぇ", "日本 VTuber，めいどるーちぇ所属的女仆系，官方自述 YouTube 以睡眠导入 ASMR 为主、每晚 23 点档，频道约 12.7 万订阅。", "ASMR,KU100,睡眠导入", 237, "UCZkZnbVO2bECxwcGlE9YOGg", "@kimitsutenka"),
  {
    slug: "santa", name: "SantaApua", nameAlt: "あぷあ", region: "jp", agency: "个人势",
    reason: "日本 Twitch ASMR 专门主播，频道名「あぷあのお部屋」；未核实到官方 YouTube 频道，只收录 Twitch。", tags: "ASMR,Twitch,睡眠导入", sortRank: 238,
    channels: [{ platform: "twitch", accountId: "santa_apua", handle: "santa_apua", url: "https://www.twitch.tv/santa_apua", appUrl: "twitch://stream/santa_apua" }],
  },
  {
    slug: "setsune", name: "梵雪音", nameAlt: "Soyogi Setsune", region: "jp", agency: "个人势",
    reason: "日本 VTuber，ASMR 直播主场在 Twitch（2026-10 仍有 ASMR 配信），YouTube 以游戏配信为主。", tags: "ASMR,游戏,Twitch", sortRank: 239,
    channels: [
      { platform: "youtube", accountId: "UC2yM1hTd8WNSdeS-zrnvxhg", handle: "@setsunekoCH", url: "https://www.youtube.com/@setsunekoCH", appUrl: "youtube://www.youtube.com/@setsunekoCH" },
      { platform: "twitch", accountId: "setsunekoch", handle: "setsunekoch", url: "https://www.twitch.tv/setsunekoch", appUrl: "twitch://stream/setsunekoch" },
    ],
  },
  yt("korisu", "こりす", "Korisu", "个人势", "自由声优出身的 VTuber，每周四 23 点固定 ASMR 配信，频道约 18 万订阅，2026-11 仍在播。", "ASMR,声优,耳かき", 240, "UCy0xHQq7g7MSNKKKzAPVJEw", "@korisuvoice"),
  yt("hanamiya", "花宫莉歌", "花宮莉歌", "个人势", "前身是 2010 年出道的资深配信者「利香」，2024 年以 VTuber 出道；每周二固定 ASMR 配信，频道约 70 万订阅。", "ASMR,KU100,歌", 241, "UCz4jhqrCfthF8NnldZeK_rw", "@HanamiyaRica"),
  yt("yumemi", "雲之上夢見", "くもの上ユメミ", "个人势", "个人势，已转型 ASMR 中心，KU100 耳かき与囁き，频道约 15.7 万订阅，2026-11 仍在播。", "ASMR,KU100,囁き", 242, "UCRUFY2ZCyVOvC-1rJIVZlKg", "@YumemiChannel"),
  yt("mutou", "無糖しお", "Mutou Shio", "个人势", "创作者系个人势，ASMR 情景语音与投稿为主要内容之一，频道约 8.1 万订阅，2026 年仍有新作与配信。", "ASMR,情景语音,创作", 243, "UCQU6SWDHJSaN4mcoRxK_kyw", "@無糖しお_MutouShio"),
  yt("uise", "憂世いう", "Uise Iu", "个人势", "个人势，现行（三代目）频道每周四深夜固定 ASMR，KU100 耳エステ为招牌，2026-11 仍在播。", "ASMR,KU100,睡眠导入", 244, "UCkIKFUq55-oUsVsOUGQ7qXA", "@uise_iuch"),
  yt("aria", "月紫アリア", "Tsukushi Aria", "Re:AcT", "Re:AcT 所属，歌与 ASMR 双主线，ASMR 音声作品与配信持续产出，2026-11 仍在播。", "ASMR,歌", 245, "UC5XQhzMH08PgWa4Zp02Gcsw", "@tsukushi_aria"),
  yt("sharo", "双葉シャロ", "Futaba Sharo", "个人势", "个人势（原 Marble Creators）；主频道以游戏为主，此处收录其自设的 ASMR 专用频道，KU100，2026-11 仍有 ASMR 配信。", "ASMR,KU100,睡眠导入", 246, "UCAvfo6jlUf_qAAEHkAjsHwg", "@シャロ双葉-l4v"),
  yt("nemu", "白羽ねむ", "Shiroha Nemu", "个人势", "个人势，KU100 ASMR 与歌枠并行，2026-10 末仍有 ASMR 直播。", "ASMR,KU100,歌", 247, "UCU6XL1U-MB7D7fFTSF2e_Pg", "@nemuch.4632"),
  yt("mashiro", "麻倉ましろ", "Asakura Mashiro", "个人势", "个人势 2.5 次元，官方定位 ASMR 特化，ASMR 作品与配信并行，频道 2026-11 仍活跃。", "ASMR,歌,2.5次元", 248, "UCh3XwI2QbanwnNyISheaTrA", "@Mashirogames"),
  {
    slug: "pikon", name: "網野ぴこん", nameAlt: "Amino Pikon", region: "jp", agency: "个人势",
    reason: "个人势，ASMR 配信为中心；近年直播主场移至 Twitch（Partner，2026-11 仍在播），YouTube 以投稿为主。", tags: "ASMR,Twitch,睡眠导入", sortRank: 249,
    channels: [
      { platform: "youtube", accountId: "UCaHOwP5OBwQ1KmpV6u6vWjQ", handle: "@PikonAmino", url: "https://www.youtube.com/@PikonAmino", appUrl: "youtube://www.youtube.com/@PikonAmino" },
      { platform: "twitch", accountId: "aminopikon", handle: "aminopikon", url: "https://www.twitch.tv/aminopikon", appUrl: "twitch://stream/aminopikon" },
    ],
  },
  yt("yotogi", "夜伽せら", "Yotogi Sera", "个人势", "个人势，每周多日生配信，KU100 ASMR 与歌为双主线，2026-11 仍在播。", "ASMR,KU100,歌", 250, "UCYwkUiLCGEodGRzpmgazaBA", "@SeraYotogi"),
  {
    slug: "ohka", name: "ひなみ桜花", nameAlt: "Hinami Ohka", region: "jp", agency: "个人势",
    reason: "魅魔女仆人设，ASMR 直播主场在 Twitch（Partner，2026-11 仍活跃），YouTube 为游戏向副频道。", tags: "ASMR,Twitch,游戏", sortRank: 251,
    channels: [
      { platform: "youtube", accountId: "UC7gZVq5zaUY4Djgm7d9G7yw", handle: "@hinqch", url: "https://www.youtube.com/@hinqch", appUrl: "youtube://www.youtube.com/@hinqch" },
      { platform: "twitch", accountId: "ohkaxx", handle: "ohkaxx", url: "https://www.twitch.tv/ohkaxx", appUrl: "twitch://stream/ohkaxx" },
    ],
  },
  yt("ina17", "いな₁₇", "Ina", "个人势", "新人组合「はもゆり」成员（与お子₀₅），ASMR 配信与投稿并行，2026 年春夏有连续 ASMR 直播存档。", "ASMR,はもゆり,囁き", 252, "UCRcSd9NtrnXmiSYjGbOHElg", "@ina17live"),
  yt("oko05", "お子₀₅", "Oko", "个人势", "新人组合「はもゆり」成员（与いな₁₇），出道以来 ASMR 配信高频，频道约 8.8 万订阅，2026-11 仍在播。", "ASMR,はもゆり,KU100", 253, "UCQtohfgViAqHGMOf1nwaeJQ", "@05_ok"),
  // ---- 神椿（KAMITSUBAKI STUDIO） -------------------------------------
  // 2026-11-12 按官方站 kamitsubaki.jp ARTISTS 页全员核验入册：组合
  // （V.W.P / VALIS / 心世紀 / 罪十罰）按成员个人入册，不建组合条目。
  // 频道逐个以 YouTube 频道页回读 externalId + 频道名 + 头像核对；
  // VALIS 三人另以频道 RSS 确认个人频道 2026-11 仍在直播。
  // 未入册者与原因见 DATA-PLAN 2026-11-12 神椿批记录（存流已结束
  // 活动、te'resa 官方频道 2023-03 后无新投稿、VALIS 的 MYU / VITTE
  // 无个人频道、梓川 / 詩道 / Sooda / ANMC 两人为真人音乐人等）。
  yt("kaf", "花譜", "KAF", "神椿（KAMITSUBAKI STUDIO）", "神椿头牌虚拟歌手，V.W.P 的核心；另以「廻花（KAIKA）」名义活动，同为本人，不另建条目。原创与演唱会为主，偶有直播。", "歌,音乐,V.W.P", 260, "UCQ1U65-CQdIoZ2_NA4Z4F7A", "@virtual_kaf"),
  yt("rim", "理芽", "RIM", "神椿（KAMITSUBAKI STUDIO）", "V.W.P 成员，透明感与艳丽感并存的次世代虚拟歌手，日英韩三语曲目都唱。", "歌,音乐,V.W.P", 261, "UCfBkUgaJ6eqYA9_TX2cmq9A", "@RIM_virtual"),
  yt("harusaruhi", "春猿火", "Harusaruhi", "神椿（KAMITSUBAKI STUDIO）", "V.W.P 成员，虚拟歌手兼说唱，HIPHOP 底色 + 强节奏，歌回密度高。", "歌,说唱,V.W.P", 262, "UCE7gtjLeZKNXLp5YURzYYeg", "@harusaruhi"),
  yt("isekaijoucho", "ヰ世界情緒", "Isekaijoucho", "神椿（KAMITSUBAKI STUDIO）", "V.W.P 成员，虚拟暗黑系歌手，作词作曲绘画都自己来的创作型。", "歌,音乐,V.W.P,创作", 263, "UCah4_WVjmr8XA7i5aigwV-Q", "@isekaijoucho"),
  yt("koko", "幸祜", "KOKO", "神椿（KAMITSUBAKI STUDIO）", "V.W.P 成员，摇滚系虚拟歌手，爆发力唱功 + 吉他弹唱。", "歌,摇滚,V.W.P", 264, "UC7Gow-kNHq21oejSIDg9PAg", "@KOKO__virtual"),
  yt("ciel", "CIEL", "CIEL", "神椿（KAMITSUBAKI STUDIO）", "神椿选拔出身的虚拟歌手，剧场动画《电影大好きポンポさん》主题歌演唱者；与 Sooda 的组合「空爽」成员（组合不单独建条目）。", "歌,音乐", 265, "UCRvkXFtB70ZADg4L6A8L3wQ", "@CIEL_VanillaSky"),
  yt("asu", "明透", "ASU", "神椿（KAMITSUBAKI STUDIO）", "SINSEKAI RECORD 虚拟歌手，通透系歌声，歌与直播并行；原组合 Albemuth 已结束活动，现以个人名义活动。", "歌,音乐,SINSEKAI", 266, "UCBLGjbYv6-xxju1i44RjnnA", "@ASU_virtual"),
  yt("bema", "琶舞", "BEMA", "神椿（KAMITSUBAKI STUDIO）", "SINSEKAI RECORD 虚拟歌手，2025-04 出道的新人，势头正猛。", "歌,音乐,SINSEKAI,新人", 267, "UCO6mA1hC3Gv9jEoCTITjAQw", "@virtual_BEMA"),
  yt("chino", "CHINO", "チノ", "神椿（KAMITSUBAKI STUDIO）", "VALIS 成员（组合 2025-12 起无限期休止），个人频道持续直播中，游戏与杂谈都播。", "歌,游戏,杂谈,VALIS", 268, "UCJ0PCT2OVrvWGfSdrpG5Stw", "@v-chino"),
  yt("neffy", "NEFFY", "ネフィ", "神椿（KAMITSUBAKI STUDIO）", "VALIS 成员（组合无限期休止中），个人频道「ネフィの楽屋」持续杂谈直播。", "歌,杂谈,VALIS", 269, "UCdnKpUAm-dcxUFi81w8x8Cg", "@v-neffy"),
  yt("rara", "RARA", "ララ", "神椿（KAMITSUBAKI STUDIO）", "VALIS 成员（组合无限期休止中），个人频道活跃，游戏与联动直播多。", "歌,游戏,VALIS", 270, "UCUHTdqEOFW_X4wGPOIayzkg", "@v-rara"),
  yt("orihime", "御莉姫", "ORIHIME", "神椿（KAMITSUBAKI STUDIO）", "少女革命計画「心世紀」成员，虚拟歌手，歌唱担当。", "歌,音乐,心世紀", 271, "UCPzB4ROWho13wC9ngTCz1hA", "@orihime_grp"),
  yt("kakyoin", "佳鏡院", "KAKYOIN", "神椿（KAMITSUBAKI STUDIO）", "少女革命計画「心世紀」成员，虚拟歌手。", "歌,音乐,心世紀", 272, "UC0w13AZfaxfatdHdF-bhN3Q", "@kakyoin_grp"),
  yt("garasumiya", "硝子宮", "GARASUMIYA", "神椿（KAMITSUBAKI STUDIO）", "少女革命計画「心世紀」成员，虚拟歌手。", "歌,音乐,心世紀", 273, "UCzArdRlyB498Ksl8BIiD6ZA", "@garasumiya_grp"),
  yt("hinageshi", "氷夏至", "HINAGESHI", "神椿（KAMITSUBAKI STUDIO）", "少女革命計画「罪十罰」成员，虚拟歌手。", "歌,音乐,罪十罰", 274, "UCTZyqEU7dSXbc4b-NBolgMg", "@hinageshi_grp"),
  yt("mikoto", "美古途", "MIKOTO", "神椿（KAMITSUBAKI STUDIO）", "少女革命計画「罪十罰」成员，虚拟歌手。", "歌,音乐,罪十罰", 275, "UC1GH6W6CzBUCR_3oHegiBGw", "@mikoto_grp"),
  yt("yunagi", "夕凪機", "YUNAGI", "神椿（KAMITSUBAKI STUDIO）", "少女革命計画「罪十罰」成员，虚拟歌手。", "歌,音乐,罪十罰", 276, "UC9tOWVNzMaXDD5SxKP1zAug", "@yunagi_grp"),
];

// ---------------------------------------------------------------------------
// Primary platform per multi-platform member (user rule, 2026-11-10:
// 「如果有人 youtube 和 twitch 同时开播，onair 优先推她的主要直播平台」).
// Each call below rests on a verifiable signal, not a guess — the basis
// is recorded per person in DATA-PLAN.md (2026-11-10 主要平台判定表):
// an explicit "X 为主" in her verified profile/roster notes, an official
// agency main channel with the other platform documented as a side
// venue (specialty / tournament streams), or a clear scale gap between
// the two platforms. Members with a single channel need no entry: their
// only platform is their primary platform.
// ---------------------------------------------------------------------------

export type Platform = "youtube" | "twitch" | "bilibili";

const PRIMARY_PLATFORM: Record<string, Platform> = {
  ui: "youtube", // 时雨羽衣: YouTube ~230万订阅主阵地，B站为中文副阵地
  lumi: "twitch", // Kaneko Lumi: Phase 中少见的 Twitch 中心成员
  bao: "twitch", // Bao: 主战场 Twitch（补录时即按此核验）
  cottontail: "twitch", // CottontailVA: Twitch Partner，YT 为切片频道
  veibae: "twitch", // Veibae: 卡面明记「Twitch 为主」
  beni: "youtube", // 八雲べに: VSPO 官方主频道 YouTube，Twitch 仅 FPS 专场
  ren: "youtube", // 如月怜: VSPO 官方主频道 YouTube，Twitch 仅大会联动
  ramune: "youtube", // 白波来梦: VSPO 官方主频道 YouTube，「另有 Twitch 阵地」
  henya: "twitch", // Henya: 卡面明记「Twitch 为主」
  haruka: "twitch", // Haruka Karibu: 卡面明记「Twitch 为主」
  kson: "youtube", // Kson: primarily YouTube, occasionally Twitch（Wiki 明记）
  dooby: "youtube", // Dooby: 双推流，但 YT 量级占优（订阅/出道峰值同接）
  // ASMR 名单批次（2026-11-10，判定依据逐人记在 DATA-PLAN.md）:
  suzuki: "twitch", // 鈴木ゆら: YT 直播已停 5 个月，2026-11 在 Twitch 几乎每日 ASMR 配信
  yamada: "twitch", // 山田めい: Twitch 主场（近 30 天约 110 小时），YT 为副阵地
  meruku: "youtube", // 鈴白めるく: 双栖同频，官方链接首列 YouTube 且 YT 为 ASMR 定期档主场
  setsune: "twitch", // 梵雪音: ASMR 直播在 Twitch，YT 以游戏配信为主
  pikon: "twitch", // 網野ぴこん: YT 直播停约 1 年，直播主场已移 Twitch
  ohka: "twitch", // ひなみ桜花: ASMR 直播主场 Twitch（Partner），YT 为游戏副频道
};

/** Her primary platform: the explicit table first, then the stored
 *  column, then — for single-platform members — the only platform she
 *  has. Returns "" only for a member with no channels at all. */
export function primaryPlatformOf(
  slug: string,
  stored: string | null | undefined,
  platforms: Platform[],
): Platform | "" {
  return (
    PRIMARY_PLATFORM[slug] ??
    (stored === "youtube" || stored === "twitch" || stored === "bilibili"
      ? stored
      : undefined) ??
    (platforms.length === 1 ? platforms[0] : undefined) ??
    platforms[0] ??
    ""
  );
}
