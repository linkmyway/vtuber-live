import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
memo,
useCallback,
useEffect,
useMemo,
useRef,
useState,
type CSSProperties, type ReactNode
} from "react";
import { api, type ApiResponse } from "./api";

import marine from "./assets/avatars-sm/marine.jpg";
import pekora from "./assets/avatars-sm/pekora.jpg";
import suisei from "./assets/avatars-sm/suisei.jpg";
import miko from "./assets/avatars-sm/miko.jpg";
import fubuki from "./assets/avatars-sm/fubuki.jpg";
import ayame from "./assets/avatars-sm/ayame.jpg";
import haato from "./assets/avatars-sm/haato.jpg";
import matsuri from "./assets/avatars-sm/matsuri.jpg";
import kotone from "./assets/avatars-sm/kotone.png";
import asagi from "./assets/avatars-sm/asagi.jpg";
import calliope from "./assets/avatars-sm/calliope.jpg";
import bijou from "./assets/avatars-sm/bijou.jpg";
import shiori from "./assets/avatars-sm/shiori.jpg";
import nerissa from "./assets/avatars-sm/nerissa.jpg";
import saba from "./assets/avatars-sm/saba.jpg";
import ironmouse from "./assets/avatars-sm/ironmouse.png";
import shylily from "./assets/avatars-sm/shylily.png";
import chibidoki from "./assets/avatars-sm/chibidoki.png";
import taffy from "./assets/avatars-sm/taffy.jpg";
import shinku from "./assets/avatars-sm/shinku.jpg";
import jiaran from "./assets/avatars-sm/jiaran.jpg";
import nailin from "./assets/avatars-sm/nailin.jpg";
import nana7mi from "./assets/avatars-sm/nana7mi.jpg";
import hinome from "./assets/avatars-sm/hinome.jpg";
import anninmiru from "./assets/avatars-sm/anninmiru.jpg";
import jiaotu from "./assets/avatars-sm/jiaotu.png";
import sora from "./assets/avatars-sm/sora.jpg";
import subaru from "./assets/avatars-sm/subaru.jpg";
import korone from "./assets/avatars-sm/korone.jpg";
import okayu from "./assets/avatars-sm/okayu.jpg";
import mio from "./assets/avatars-sm/mio.jpg";
import watame from "./assets/avatars-sm/watame.jpg";
import towa from "./assets/avatars-sm/towa.jpg";
import luna from "./assets/avatars-sm/luna.jpg";
import mito from "./assets/avatars-sm/mito.jpg";
import kaede from "./assets/avatars-sm/kaede.jpg";
import toko from "./assets/avatars-sm/toko.jpg";
import ange from "./assets/avatars-sm/ange.jpg";
import lize from "./assets/avatars-sm/lize.jpg";
import saku from "./assets/avatars-sm/saku.jpg";
import himawari from "./assets/avatars-sm/himawari.jpg";
import mahiro from "./assets/avatars-sm/mahiro.jpg";
import sumire from "./assets/avatars-sm/sumire.jpg";
import uruha from "./assets/avatars-sm/uruha.jpg";
import noah from "./assets/avatars-sm/noah.jpg";
import ui from "./assets/avatars-sm/ui.jpg";
import sana from "./assets/avatars-sm/sana.jpg";
import roa from "./assets/avatars-sm/roa.jpg";
import ruka from "./assets/avatars-sm/ruka.jpg";
import sakuna from "./assets/avatars-sm/sakuna.jpg";
import patra from "./assets/avatars-sm/patra.jpg";
import ena from "./assets/avatars-sm/ena.jpg";
import kiara from "./assets/avatars-sm/kiara.jpg";
import ina from "./assets/avatars-sm/ina.jpg";
import baelz from "./assets/avatars-sm/baelz.jpg";
import kronii from "./assets/avatars-sm/kronii.jpg";
import irys from "./assets/avatars-sm/irys.jpg";
import gigi from "./assets/avatars-sm/gigi.jpg";
import cecilia from "./assets/avatars-sm/cecilia.jpg";
import raora from "./assets/avatars-sm/raora.jpg";
import elizabeth from "./assets/avatars-sm/elizabeth.jpg";
import lumi from "./assets/avatars-sm/lumi.jpg";
import pippa from "./assets/avatars-sm/pippa.jpg";
import tenma from "./assets/avatars-sm/tenma.jpg";
import bao from "./assets/avatars-sm/bao.jpg";
import nyanners from "./assets/avatars-sm/nyanners.png";
import froot from "./assets/avatars-sm/froot.png";
import melody from "./assets/avatars-sm/melody.png";
import zentreya from "./assets/avatars-sm/zentreya.png";
import cottontail from "./assets/avatars-sm/cottontail.jpg";
import rollcake from "./assets/avatars-sm/rollcake.png";
import silvervale from "./assets/avatars-sm/silvervale.png";
import fallenshadow from "./assets/avatars-sm/fallenshadow.png";
import bella from "./assets/avatars-sm/bella.jpg";
import xiangwan from "./assets/avatars-sm/xiangwan.jpg";
import lingyuan from "./assets/avatars-sm/lingyuan.jpg";
import nanako from "./assets/avatars-sm/nanako.jpg";
import azi from "./assets/avatars-sm/azi.jpg";
import veibae from "./assets/avatars-sm/veibae.jpg";
import beni from "./assets/avatars-sm/beni.jpg";
import ema from "./assets/avatars-sm/ema.jpg";
import runa from "./assets/avatars-sm/runa.jpg";
import mary from "./assets/avatars-sm/mary.jpg";
import charlotte from "./assets/avatars-sm/charlotte.jpg";
import miko_sekishiro from "./assets/avatars-sm/miko_sekishiro.jpg";
import shiina from "./assets/avatars-sm/shiina.jpg";
import uruka from "./assets/avatars-sm/uruka.jpg";
import lia from "./assets/avatars-sm/lia.jpg";
import enna from "./assets/avatars-sm/enna.jpg";
import millie from "./assets/avatars-sm/millie.jpg";
import finana from "./assets/avatars-sm/finana.jpg";
import maria from "./assets/avatars-sm/maria.jpg";
import michi from "./assets/avatars-sm/michi.png";
import matara from "./assets/avatars-sm/matara.png";
import tamako from "./assets/avatars-sm/tamako.jpg";
import akari_ishikari from "./assets/avatars-sm/akari_ishikari.jpg";
import chiyomi from "./assets/avatars-sm/chiyomi.jpg";
import rieru from "./assets/avatars-sm/rieru.jpg";
import yui_hizuki from "./assets/avatars-sm/yui_hizuki.jpg";
import yotsuha from "./assets/avatars-sm/yotsuha.jpg";
import teto from "./assets/avatars-sm/teto.jpg";
import momo_kurumizawa from "./assets/avatars-sm/momo_kurumizawa.jpg";
import rose from "./assets/avatars-sm/rose.jpg";
import goudan from "./assets/avatars-sm/goudan.jpg";
import sui from "./assets/avatars-sm/sui.jpg";
import lamy from "./assets/avatars-sm/lamy.jpg";
import botan from "./assets/avatars-sm/botan.jpg";
import nene from "./assets/avatars-sm/nene.jpg";
import polka from "./assets/avatars-sm/polka.jpg";
import flare from "./assets/avatars-sm/flare.jpg";
import noel from "./assets/avatars-sm/noel.jpg";
import choco from "./assets/avatars-sm/choco.jpg";
import aki from "./assets/avatars-sm/aki.jpg";
import roboco from "./assets/avatars-sm/roboco.jpg";
import azki from "./assets/avatars-sm/azki.jpg";
import lui from "./assets/avatars-sm/lui.jpg";
import koyori from "./assets/avatars-sm/koyori.jpg";
import iroha from "./assets/avatars-sm/iroha.jpg";
import laplus from "./assets/avatars-sm/laplus.jpg";
import kanade from "./assets/avatars-sm/kanade.jpg";
import ririka from "./assets/avatars-sm/ririka.jpg";
import raden from "./assets/avatars-sm/raden.jpg";
import hajime from "./assets/avatars-sm/hajime.jpg";
import riona from "./assets/avatars-sm/riona.jpg";
import niko from "./assets/avatars-sm/niko.jpg";
import su from "./assets/avatars-sm/su.jpg";
import chihaya from "./assets/avatars-sm/chihaya.jpg";
import vivi from "./assets/avatars-sm/vivi.jpg";
import kokoro from "./assets/avatars-sm/kokoro.jpg";
import ars from "./assets/avatars-sm/ars.jpg";
import sango from "./assets/avatars-sm/sango.jpg";
import furen from "./assets/avatars-sm/furen.jpg";
import nazuna from "./assets/avatars-sm/nazuna.jpg";
import toto from "./assets/avatars-sm/toto.jpg";
import mimi from "./assets/avatars-sm/mimi.jpg";
import sena from "./assets/avatars-sm/sena.jpg";
import hinano from "./assets/avatars-sm/hinano.jpg";
import lisa from "./assets/avatars-sm/lisa.jpg";
import ren from "./assets/avatars-sm/ren.jpg";
import qpi from "./assets/avatars-sm/qpi.jpg";
import tsuna from "./assets/avatars-sm/tsuna.jpg";
import ramune from "./assets/avatars-sm/ramune.jpg";
import met from "./assets/avatars-sm/met.jpg";
import akari_yumeno from "./assets/avatars-sm/akari_yumeno.jpg";
import kuromu from "./assets/avatars-sm/kuromu.jpg";
import kokage from "./assets/avatars-sm/kokage.jpg";
import yuuhi from "./assets/avatars-sm/yuuhi.jpg";
import hanabi from "./assets/avatars-sm/hanabi.jpg";
import moka from "./assets/avatars-sm/moka.jpg";
import siro from "./assets/avatars-sm/siro.jpg";
import chieri from "./assets/avatars-sm/chieri.jpg";
import suzu from "./assets/avatars-sm/suzu.jpg";
import tomari from "./assets/avatars-sm/tomari.jpg";
import hinata from "./assets/avatars-sm/hinata.jpg";
import fuwamoco from "./assets/avatars-sm/fuwamoco.jpg";
import risu from "./assets/avatars-sm/risu.jpg";
import moona from "./assets/avatars-sm/moona.jpg";
import iofi from "./assets/avatars-sm/iofi.jpg";
import ollie from "./assets/avatars-sm/ollie.jpg";
import anya from "./assets/avatars-sm/anya.jpg";
import reine from "./assets/avatars-sm/reine.jpg";
import zeta from "./assets/avatars-sm/zeta.jpg";
import kaela from "./assets/avatars-sm/kaela.jpg";
import kobo from "./assets/avatars-sm/kobo.jpg";
import elira from "./assets/avatars-sm/elira.jpg";
import petra from "./assets/avatars-sm/petra.jpg";
import reimu from "./assets/avatars-sm/reimu.jpg";
import scarle from "./assets/avatars-sm/scarle.jpg";
import meloco from "./assets/avatars-sm/meloco.jpg";
import remia from "./assets/avatars-sm/remia.jpg";
import arya from "./assets/avatars-sm/arya.jpg";
import jira from "./assets/avatars-sm/jira.jpg";
import narin from "./assets/avatars-sm/narin.jpg";
import riko from "./assets/avatars-sm/riko.jpg";
import eris from "./assets/avatars-sm/eris.jpg";
import juno from "./assets/avatars-sm/juno.jpg";
import saine from "./assets/avatars-sm/saine.jpg";
import chise from "./assets/avatars-sm/chise.jpg";
import panko from "./assets/avatars-sm/panko.jpg";
import airi from "./assets/avatars-sm/airi.jpg";
import jelly from "./assets/avatars-sm/jelly.jpg";
import dizzy from "./assets/avatars-sm/dizzy.jpg";
import abi from "./assets/avatars-sm/abi.jpg";
import yuko from "./assets/avatars-sm/yuko.jpg";
import juna from "./assets/avatars-sm/juna.jpg";
import nimi from "./assets/avatars-sm/nimi.jpg";
import henya from "./assets/avatars-sm/henya.jpg";
import haruka from "./assets/avatars-sm/haruka.jpg";
import kson from "./assets/avatars-sm/kson.jpg";
import dooby from "./assets/avatars-sm/dooby.jpg";
import wumi from "./assets/avatars-sm/wumi.jpg";
import yueyue from "./assets/avatars-sm/yueyue.jpg";
import camila from "./assets/avatars-sm/camila.png";
import filian from "./assets/avatars-sm/filian.png";
import koito from "./assets/avatars-sm/koito.jpg";
import miel from "./assets/avatars-sm/miel.jpg";
import hiiro from "./assets/avatars-sm/hiiro.jpg";
import macoto from "./assets/avatars-sm/macoto.jpg";
import kibana from "./assets/avatars-sm/kibana.jpg";
import tenshi from "./assets/avatars-sm/tenshi.jpg";
import chocolat from "./assets/avatars-sm/chocolat.jpg";
import mochizuki from "./assets/avatars-sm/mochizuki.jpg";
import kohaku from "./assets/avatars-sm/kohaku.jpg";
import reikira from "./assets/avatars-sm/reikira.jpg";
import emmamarr from "./assets/avatars-sm/emmamarr.jpg";
import sakurane from "./assets/avatars-sm/sakurane.jpg";
import suzuki from "./assets/avatars-sm/suzuki.jpg";
import yamada from "./assets/avatars-sm/yamada.jpg";
import usui from "./assets/avatars-sm/usui.jpg";
import meruku from "./assets/avatars-sm/meruku.jpg";
import kimitsu from "./assets/avatars-sm/kimitsu.jpg";
import santa from "./assets/avatars-sm/santa.png";
import setsune from "./assets/avatars-sm/setsune.jpg";
import korisu from "./assets/avatars-sm/korisu.jpg";
import hanamiya from "./assets/avatars-sm/hanamiya.jpg";
import yumemi from "./assets/avatars-sm/yumemi.jpg";
import mutou from "./assets/avatars-sm/mutou.jpg";
import uise from "./assets/avatars-sm/uise.jpg";
import aria from "./assets/avatars-sm/aria.jpg";
import sharo from "./assets/avatars-sm/sharo.jpg";
import nemu from "./assets/avatars-sm/nemu.jpg";
import mashiro from "./assets/avatars-sm/mashiro.jpg";
import pikon from "./assets/avatars-sm/pikon.jpg";
import yotogi from "./assets/avatars-sm/yotogi.jpg";
import ohka from "./assets/avatars-sm/ohka.jpg";
import ina17 from "./assets/avatars-sm/ina17.jpg";
import oko05 from "./assets/avatars-sm/oko05.jpg";
import kaf from "./assets/avatars-sm/kaf.jpg";
import rim from "./assets/avatars-sm/rim.jpg";
import harusaruhi from "./assets/avatars-sm/harusaruhi.jpg";
import isekaijoucho from "./assets/avatars-sm/isekaijoucho.jpg";
import koko from "./assets/avatars-sm/koko.jpg";
import ciel from "./assets/avatars-sm/ciel.jpg";
import asu from "./assets/avatars-sm/asu.jpg";
import bema from "./assets/avatars-sm/bema.jpg";
import chino from "./assets/avatars-sm/chino.jpg";
import neffy from "./assets/avatars-sm/neffy.jpg";
import rara from "./assets/avatars-sm/rara.jpg";
import orihime from "./assets/avatars-sm/orihime.jpg";
import kakyoin from "./assets/avatars-sm/kakyoin.jpg";
import garasumiya from "./assets/avatars-sm/garasumiya.jpg";
import hinageshi from "./assets/avatars-sm/hinageshi.jpg";
import mikoto from "./assets/avatars-sm/mikoto.jpg";
import yunagi from "./assets/avatars-sm/yunagi.jpg";

const AVATARS: Record<string, string> = {
  marine, pekora, suisei, miko, fubuki, ayame, haato, matsuri, kotone, asagi,
  calliope, bijou, shiori, nerissa, saba, ironmouse, shylily, chibidoki,
  taffy, shinku, jiaran, nailin, nana7mi, hinome, anninmiru, jiaotu,
  sora, subaru, korone, okayu, mio, watame, towa, luna, mito, kaede, toko,
  ange, lize, saku, himawari, mahiro, sumire, uruha, noah, ui, sana, roa,
  ruka, sakuna, patra, ena, kiara, ina, baelz, kronii, irys, gigi, cecilia,
  raora, elizabeth, lumi, pippa, tenma, bao, nyanners, froot, melody,
  zentreya, cottontail, rollcake, silvervale, fallenshadow, bella, xiangwan,
  lingyuan, nanako, azi,
  veibae, beni, ema, runa, mary, charlotte, miko_sekishiro, shiina, uruka,
  lia, enna, millie, finana, maria, michi, matara,
  tamako, akari_ishikari, chiyomi, rieru, yui_hizuki, yotsuha, teto,
  momo_kurumizawa, rose, goudan, sui,
  lamy, botan, nene, polka, flare, noel, choco, aki, roboco, azki, lui, koyori, iroha, laplus, kanade, ririka, raden, hajime, riona, niko, su, chihaya, vivi, kokoro, ars, sango, furen, nazuna, toto, mimi, sena, hinano, lisa, ren, qpi, tsuna, ramune, met, akari_yumeno, kuromu, kokage, yuuhi, hanabi, moka, siro, chieri, suzu, tomari, hinata, fuwamoco, risu, moona, iofi, ollie, anya, reine, zeta, kaela, kobo, elira, petra, reimu, scarle, meloco, remia, arya, jira, narin, riko, eris, juno, saine, chise, panko, airi, jelly, dizzy, abi, yuko, juna, nimi, henya, haruka, kson, dooby, wumi, camila, filian, yueyue,
  koito, miel, hiiro, macoto, kibana, tenshi, chocolat, mochizuki, kohaku,
  reikira, emmamarr, sakurane, suzuki, yamada, usui, meruku, kimitsu,
  santa, setsune, korisu, hanamiya, yumemi, mutou, uise, aria, sharo,
  nemu, mashiro, pikon, yotogi, ohka, ina17, oko05,
  kaf, rim, harusaruhi, isekaijoucho, koko, ciel, asu, bema,
  chino, neffy, rara, orihime, kakyoin, garasumiya, hinageshi, mikoto, yunagi,
};

type Board = ApiResponse<typeof api, "getBoard">;
type Vtuber = Board["vtubers"][number];
type Channel = Vtuber["channels"][number];
type Platform = Channel["platform"];
type Region = Vtuber["region"];

const PLATFORM_META: Record<Platform, { label: string; color: string }> = {
  youtube: { label: "YouTube", color: "#ff4b41" },
  twitch: { label: "Twitch", color: "#a970ff" },
  bilibili: { label: "Bilibili", color: "#fb7299" },
};

const REGIONS: { key: Region; label: string; sub: string }[] = [
  { key: "jp", label: "日文圈", sub: "按社团分组 · 含个人势" },
  { key: "en", label: "英文圈", sub: "按社团分组 · 含个人势" },
  { key: "cn", label: "中文圈", sub: "按社团分组 · 含个人势" },
  { key: "tw", label: "台湾", sub: "按社团分组 · 个人势为主" },
];

/**
 * 社团分组键：名册里「独立」「独立（台湾）」和「个人势」是同一种归属的
 * 不同写法，统一归入正式大类「个人势」——它不是「其他」，是和
 * hololive / NIJISANJI 并列的一等分组，筛选与计数都单列。
 */
function agencyGroup(v: Vtuber): string {
  const a = v.agency.trim();
  if (!a || a === "个人势" || a.startsWith("独立")) return "个人势";
  return a;
}

const compactNum = new Intl.NumberFormat("zh-CN", {
  notation: "compact",
  maximumFractionDigits: 1,
});

/**
 * Bilibili popularity → concurrent-viewer conversion, SORT-ONLY.
 * Calibrated 2026-11-11 from the six live roster rooms measured
 * against the gold rank's onlineNum (the real Bilibili concurrent
 * count the server now stores in `viewers`): ratios 人气值/onlineNum
 * were 贝拉 61.6, 勾檀 40.4, 永雏塔菲 105.7, 真红莉爱 105.9,
 * 桃井月月 196.4, 呜米 267.9 (event-inflated outlier) — median
 * ≈ 106. The server carries the same constant; the two must stay
 * in sync. This estimate ONLY orders a Bilibili stream whose real
 * onlineNum could not be fetched (viewers null): it is never
 * displayed as a headcount and never summed anywhere.
 */
const BILI_POP_PER_ONLINE = 106;

/** Effective ON AIR sort key: real concurrents first-class. */
function onAirSortKey(ch: Channel): number {
  if (ch.viewers != null) return ch.viewers;
  if (ch.platform === "bilibili" && ch.popularity != null) {
    return ch.popularity / BILI_POP_PER_ONLINE;
  }
  return 0;
}

/**
 * Roster-card audience numbers, honestly labelled (roster ONLY —
 * the main stage uses onAirHeadcounts below):
 * real concurrent viewers (YouTube watching-now / Twitch viewer
 * count / Bilibili gold-rank onlineNum) → 「同接」; Bilibili's
 * 人气值 (a weighted heat score, not a headcount) is shown
 * ALONGSIDE as its own pill → 「人气值」. The two words never swap:
 * a popularity score is never presented as 同接. A Bilibili card
 * whose onlineNum was not fetched shows 人气值 alone, exactly as
 * before — no converted estimate ever appears as a number.
 */
function headcounts(ch: Channel): { label: string; value: number }[] {
  const list: { label: string; value: number }[] = [];
  if (ch.viewers != null) list.push({ label: "同接", value: ch.viewers });
  if (ch.platform === "bilibili" && ch.popularity != null) {
    list.push({ label: "人气值", value: ch.popularity });
  }
  return list;
}

/**
 * ON AIR (main stage) audience numbers — user rule 2026-11-11:
 * 「onair b站的人气值也可以直接换成真实的同接」. The stage shows
 * ONLY the real concurrent count, under the single label 「同接」,
 * for every platform including Bilibili (whose real count is the
 * gold-rank onlineNum the server stores in `viewers`). No
 * popularity pill ever appears on the stage. When a Bilibili room's
 * onlineNum could not be fetched this round (viewers null, sorting
 * falls back to popularity ÷ 106), the 同接 slot shows 「—」 —
 * the sort-only estimate is never displayed as a headcount.
 */
function onAirHeadcounts(
  ch: Channel,
): { label: string; value: number | null }[] {
  if (ch.viewers != null) return [{ label: "同接", value: ch.viewers }];
  if (ch.platform === "bilibili") return [{ label: "同接", value: null }];
  return [];
}

/**
 * ON AIR ranking comparator: ONE mixed ranking across all three
 * platforms, keyed by real concurrent viewers (onAirSortKey).
 * Bilibili streams used to be exiled to a block after the whole
 * concurrent ranking — with real onlineNum counts they now slot
 * into the position their actual audience earns (measured after
 * the fix: 贝拉 3,781 lands mid-front, 永雏塔菲 1,740 mid-board,
 * 桃井月月 16 last on merit, not by platform). Only a Bilibili
 * stream whose onlineNum could not be fetched sorts by the
 * popularity/K estimate instead.
 */
function compareOnAir(a: Channel, b: Channel): number {
  return (
    onAirSortKey(b) - onAirSortKey(a) ||
    (b.popularity ?? 0) - (a.popularity ?? 0) ||
    (b.viewers ?? 0) - (a.viewers ?? 0)
  );
}

function fmtTime(ts: number): string {
  return new Date(ts).toLocaleTimeString("zh-CN", {
    timeZone: "Asia/Tokyo",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

function durationText(startedAt: number, ref: number): string {
  const mins = Math.max(0, Math.round((ref - startedAt) / 60000));
  if (mins < 1) return "刚刚开播";
  if (mins < 60) return `已开播 ${mins} 分钟`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m ? `已开播 ${h} 小时 ${m} 分` : `已开播 ${h} 小时`;
}

/**
 * Visibility gate for expensive always-on work. Effects (breathing
 * badges, glow pulses, tilt shine) and frame polling keep their full
 * appearance, but only RUN while their card is on screen: an
 * IntersectionObserver flips a data attribute the CSS keys off, and
 * polling components read the boolean. Off-screen cost drops to zero
 * without changing anything the viewer can see.
 */
function useInView<T extends HTMLElement>(threshold = 0.02) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        const last = entries[entries.length - 1];
        if (last) setInView(last.isIntersecting);
      },
      { threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return { ref, inView };
}

/**
 * Global frame-poll semaphore: at most 4 live cards fetch a fresh
 * frame in the same tick, so a screen full of live cards staggers its
 * 45s refreshes instead of bursting network + decode work at once.
 * The visual result is identical — every visible card still updates
 * on the same cadence, just not in the same millisecond.
 */
const pollGate = { active: 0, waiters: [] as (() => void)[] };
async function acquirePollSlot(): Promise<() => void> {
  if (pollGate.active < 4) {
    pollGate.active += 1;
  } else {
    await new Promise<void>((resolve) => pollGate.waiters.push(resolve));
    pollGate.active += 1;
  }
  let released = false;
  return () => {
    if (released) return;
    released = true;
    pollGate.active -= 1;
    const next = pollGate.waiters.shift();
    if (next) next();
  };
}

/** Pointer-tracked 3D tilt; inert on touch devices and reduced motion. */
function useTilt<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(hover: none)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.transform = `rotateY(${(x * 9).toFixed(2)}deg) rotateX(${(-y * 7).toFixed(2)}deg) translateZ(0)`;
        el.style.setProperty("--mx", `${((x + 0.5) * 100).toFixed(1)}%`);
        el.style.setProperty("--my", `${((y + 0.5) * 100).toFixed(1)}%`);
      });
    };
    const onLeave = () => {
      cancelAnimationFrame(raf);
      el.style.transform = "";
    };
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }, []);
  return ref;
}

function PlatformIcon({ platform, size = 13 }: { platform: Platform; size?: number }) {
  const c = PLATFORM_META[platform].color;
  if (platform === "youtube") {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
        <rect x="2" y="5" width="20" height="14" rx="4" fill={c} />
        <path d="M10 9.2v5.6L15 12z" fill="#fff" />
      </svg>
    );
  }
  if (platform === "twitch") {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M4 3 2.5 7v13h5v3h3l2.5-3h4l5-5V3H4zm16 10.5-3 3H12l-2.5 3v-3H5V5h15v8.5zM16 8h2v5h-2V8zm-5 0h2v5h-2V8z"
          fill={c}
        />
      </svg>
    );
  }
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M8 3 5.5 6M16 3l2.5 3" stroke={c} strokeWidth="2" strokeLinecap="round" />
      <rect x="2.5" y="6" width="19" height="13" rx="3.5" fill={c} />
      <circle cx="8.6" cy="12" r="1.5" fill="#fff" />
      <circle cx="15.4" cy="12" r="1.5" fill="#fff" />
    </svg>
  );
}

function LiveBadge({ small = false }: { small?: boolean }) {
  return (
    <span
      className={`live-badge inline-flex items-center gap-1 rounded-full font-bold text-white ${small ? "px-1.5 py-px text-[10px]" : "px-2.5 py-1 text-xs"}`}
    >
      <span className={`live-dot rounded-full bg-white ${small ? "h-1.5 w-1.5" : "h-2 w-2"}`} />
      LIVE
    </span>
  );
}

/**
 * Session badge — THIS stream is an ASMR session (the server's
 * per-session判定： platform category / title markers, never the
 * streamer's identity). Deliberately unlike the resident ASMR tag
 * (the small violet outline "ASMR" chip on a roster card's header,
 * which says SHE often does ASMR): this one is a bright gradient
 * pill with a blinking dot and the words 直播中 — it says THIS
 * stream, right now, is ASMR. An ASMR-roster member streaming a
 * game carries the small tag and NOT this pill; a non-roster
 * member's ASMR session carries this pill and no small tag.
 */
function AsmrLiveBadge({ small = false }: { small?: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-[#8b5cf6] to-[#ff2d78] font-bold text-white shadow-[0_6px_18px_-6px_rgba(255,45,120,0.8)] ${small ? "px-2 py-px text-[10px]" : "px-2.5 py-1 text-xs"}`}
    >
      <span className={`live-dot rounded-full bg-white ${small ? "h-1.5 w-1.5" : "h-2 w-2"}`} />
      ASMR 直播中
    </span>
  );
}

function PlatformChip({ platform }: { platform: Platform }) {
  const meta = PLATFORM_META[platform];
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/5 px-2 py-0.5 text-[11px] font-medium text-[var(--text)]">
      <PlatformIcon platform={platform} />
      {meta.label}
    </span>
  );
}

function Avatar({
  slug,
  name,
  size,
  live,
}: {
  slug: string;
  name: string;
  size: number;
  live?: boolean;
}) {
  const src = AVATARS[slug];
  return (
    <span
      className={`relative inline-flex shrink-0 rounded-full p-[2.5px] ${live ? "avatar-ring-live" : "avatar-ring"}`}
      style={{ width: size + 5, height: size + 5 }}
    >
      <span className="block h-full w-full overflow-hidden rounded-full bg-[var(--surface-2)]">
        {src ? (
          <img src={src} alt={`${name} 的头像`} width={size} height={size} className="h-full w-full object-cover" loading="lazy" />
        ) : (
          <span className="flex h-full w-full items-center justify-center font-[family-name:var(--font-display)] text-lg font-bold text-[var(--dim)]">
            {name.slice(0, 1)}
          </span>
        )}
      </span>
    </span>
  );
}

/**
 * The two watch buttons must land in different places:
 * - "App" hands the platform's canonical https URL to the system in a new
 *   tab; iOS/Android universal links route it into the native app when it is
 *   installed (a custom scheme like vnd.youtube:// is silently swallowed by
 *   the webview and goes nowhere — that was the old dead-button bug).
 * - "网页" must stay in the browser, so for YouTube it uses the
 *   youtube-nocookie embed player page, a domain no app claims via
 *   universal links. Other platforms have no equivalent unclaimed watch
 *   page, so their web button uses the same canonical URL.
 * - Bilibili follows the same https rule (user report, 2026-11-10,
 *   superseding the earlier bilibili:// exception): an earlier round
 *   pointed the App button at the room deep link bilibili://live/<roomId>
 *   because the plain https page had landed on her personal space page
 *   — but the custom scheme is silently swallowed by this WebView on
 *   the main stage too (the user reported 贝拉's stage 「App 看直播」
 *   doing nothing), exactly like the roster cards before their fix.
 *   The App target is therefore the room's https universal link
 *   https://live.bilibili.com/<roomId> — the room id is the verified
 *   one carried by the channel (its live status appLiveUrl, in
 *   whichever form a past refresh stored it, its appUrl, or parsed
 *   from the live/web room URL) — so with the Bilibili app installed
 *   the system routes it into the app's live room, and without it the
 *   web room page opens. Live or offline the target is the ROOM,
 *   never her space page. The web button stays on the same https room
 *   page, unchanged.
 */
function watchTargets(ch: Channel): { appTarget: string; webTarget: string } {
  const page = ch.liveUrl || ch.url;
  let appTarget = page;
  let webTarget = page;
  if (ch.platform === "youtube") {
    const vid = page.match(/[?&]v=([\w-]{11})/)?.[1];
    if (vid) webTarget = `https://www.youtube-nocookie.com/embed/${vid}`;
  }
  if (ch.platform === "bilibili") {
    const roomId =
      ch.appLiveUrl.match(/bilibili:\/\/live\/(\d+)/)?.[1] ??
      ch.appLiveUrl.match(/live\.bilibili\.com\/(\d+)/)?.[1] ??
      ch.appUrl.match(/bilibili:\/\/live\/(\d+)/)?.[1] ??
      page.match(/live\.bilibili\.com\/(\d+)/)?.[1] ??
      ch.url.match(/live\.bilibili\.com\/(\d+)/)?.[1];
    if (roomId) {
      appTarget = `https://live.bilibili.com/${roomId}`;
      webTarget = `https://live.bilibili.com/${roomId}`;
    }
  }
  return { appTarget, webTarget };
}

/**
 * Roster-card buttons (user spec, 2026-11-10): two buttons with fixed
 * jobs and labels that say exactly where they land —
 * - 「个人主页」 always opens her profile ON HER PRIMARY PLATFORM
 *   (user rule: 「个人主页的优先显示要选择 vup 主要使用的平台」 —
 *   e.g. 时雨羽衣 has YouTube + Bilibili, so her button lands on her
 *   YouTube channel page, never her Bilibili space): the YouTube /
 *   Twitch channel page, or for Bilibili her personal space page,
 *   built from that primary channel's verified UID (accountId):
 *   space.bilibili.com/<UID>. Which channel is primary is decided in
 *   PersonCard from v.primaryPlatform — the server's verified
 *   PRIMARY_PLATFORM table — never from whichever channel happens to
 *   be displayed, live, or selected by a platform filter.
 * - 「直播间」 always opens her live room: the current stream's watch
 *   page while she is live (or in a waiting-room chat), and the room
 *   page itself while she is not — the YouTube channel /live page,
 *   the Twitch channel page, or live.bilibili.com/<roomId> built
 *   from the channel's verified roomId. UID and roomId are never
 *   mixed up.
 * Both targets are canonical https URLs on purpose: this WebView
 * silently swallows custom schemes (vnd.youtube:// was a dead button
 * earlier, and the user reported bilibili://live/<roomId> doing
 * nothing on 2026-11-10), while the platforms' universal links route
 * the same https URL into the native App when it is installed, and
 * into the web page when it is not. The main stage card keeps using
 * watchTargets above; these resolvers serve the roster cards only.
 */
function profileTargetFor(ch: Channel): string {
  if (ch.platform === "bilibili") {
    return `https://space.bilibili.com/${ch.accountId}`;
  }
  return ch.url;
}

function roomTargetFor(ch: Channel): string {
  if ((ch.state === "live" || ch.state === "chat") && ch.liveUrl) {
    return ch.liveUrl;
  }
  if (ch.platform === "youtube") {
    return `https://www.youtube.com/channel/${ch.accountId}/live`;
  }
  if (ch.platform === "bilibili") {
    const roomId =
      ch.roomId || ch.url.match(/live\.bilibili\.com\/(\d+)/)?.[1];
    if (roomId) return `https://live.bilibili.com/${roomId}`;
  }
  return ch.url;
}

/**
 * The ONE live stream of hers the board pushes (user rule: 「youtube
 * 和 twitch 同时开播，onair 优先推她的主要直播平台」). When several of
 * her channels are live at once, the primary platform's stream wins —
 * its title, game, viewers and frame are what the ON AIR ticker and
 * the main stage show, and she appears exactly once. When the primary
 * platform is not live, the live secondary stream is featured as
 * usual: priority only orders simultaneous streams, it never hides a
 * lone one. Under an explicit platform filter the filter wins — the
 * stage is channel-level there by design. The server applies the same
 * rule to the headcount and the hot-games aggregation.
 */
function featuredLiveChannel(
  v: Vtuber,
  platformFilter: Platform | "all",
): Channel | undefined {
  const lives = v.channels.filter((c) => c.state === "live");
  if (lives.length === 0) return undefined;
  if (platformFilter !== "all") {
    return lives.find((c) => c.platform === platformFilter);
  }
  return (
    lives.find((c) => c.platform === v.primaryPlatform) ??
    lives.reduce<Channel | undefined>(
      (best, c) =>
        best == null || onAirSortKey(c) > onAirSortKey(best) ? c : best,
      undefined,
    )
  );
}

/** Cache-busting query param so a polled frame URL is never served stale. */
function withBust(url: string, bust: number): string {
  if (!bust) return url;
  return `${url}${url.includes("?") ? "&" : "?"}t=${bust}`;
}

/**
 * Where a channel's card picture comes from — each platform's own
 * source, honestly labelled:
 * - YouTube: NO real-time frame. An exhaustive re-check (2026-11-09,
 *   two live streams) proved YouTube serves no live frame wider than
 *   the storyboard's 159×90 tiles: the player response carries exactly
 *   one live storyboard spec, its sheet path is signature-bound (any
 *   mutated size/grid returns 403), and every *_live still is
 *   byte-identical to the static cover. Per the user's call, YouTube
 *   cards therefore show the stream's CURRENT COVER — the server picks
 *   the highest real tier (maxresdefault 1280×720, else hqdefault) and
 *   stores a copy — labelled 直播封面， `realtime: false`, never
 *   polled and never passed off as a screenshot. A stale storyboard
 *   template left in screenshotUrl by an older refresh is ignored.
 * - Twitch: the official previews-ttv live_user frame at 1280×720,
 *   which Twitch re-renders while the channel is live (derivable from
 *   the login) — a real frame, polled every 45s.
 * - Bilibili: the room keyframe — Bilibili's system screenshot of the
 *   room, refreshed by the platform while streaming. It only exists in
 *   the room-info response, so it arrives via the server's
 *   screenshotUrl; a Bilibili channel without one has NO real-time
 *   frame and falls back to its room cover, labelled as a cover.
 * `posterUrl` is the server-stored copy served from this artifact's own
 * storage. Only for Twitch is it a copy of the live frame itself
 * (`posterIsFrame`); for YouTube it is the stream's cover art and for
 * Bilibili the room cover — fallback pictures, never frames. The
 * channel avatar is NOT part of this chain: a VTuber's portrait is
 * neither a screenshot nor a cover, and an earlier build's avatar
 * fallback is exactly what left the main-stage cards showing portraits
 * with no screenshot label.
 * Returns null when there is not even a cover to show.
 */
type DirectSource = {
  kind: "direct";
  url: string;
  realtime: boolean;
  posterUrl: string;
  posterIsFrame: boolean;
};
type ShotSource = DirectSource;

function screenshotSource(ch: Channel): ShotSource | null {
  let frameUrl = "";
  let realtime = true;
  if (ch.platform === "youtube") {
    // Cover only (see above): prefer the server's chosen cover URL; a
    // leftover storyboard template from an older refresh is not a
    // loadable picture, so fall back to deriving the cover from the
    // video id — maxresdefault first, matching the server's tier pick.
    realtime = false;
    if (ch.screenshotUrl && !ch.screenshotUrl.includes("/sb/")) {
      frameUrl = ch.screenshotUrl;
    } else {
      const vid = (ch.liveUrl || ch.url).match(/[?&]v=([\w-]{11})/)?.[1];
      if (vid) frameUrl = `https://i.ytimg.com/vi/${vid}/maxresdefault.jpg`;
    }
  } else if (ch.screenshotUrl) {
    frameUrl = ch.screenshotUrl;
  } else if (ch.platform === "twitch" && ch.handle) {
    // previews-ttv serves real frames at arbitrary sizes (verified);
    // 1280×720 matches the server-stored copy's resolution.
    frameUrl = `https://static-cdn.jtvnw.net/previews-ttv/live_user_${ch.handle}-1280x720.jpg`;
  }
  const posterUrl = ch.thumbUrl || "";
  const posterIsFrame = !!posterUrl && ch.platform === "twitch";
  if (frameUrl) return { kind: "direct", url: frameUrl, realtime, posterUrl, posterIsFrame };
  if (posterUrl) return { kind: "direct", url: posterUrl, realtime: false, posterUrl: "", posterIsFrame: false };
  return null;
}

function fmtClock(ts: number): string {
  return new Date(ts).toLocaleTimeString("zh-CN", {
    timeZone: "Asia/Tokyo",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}

/**
 * A live channel's card picture — NOT a video player. The embedded
 * players would not play inside the app WebView (confirmed on the
 * user's device), so the player and every in-page play entry are gone;
 * what remains is the picture, kept as fresh as the platform allows:
 * - Twitch / Bilibili show the platform's own live frame (see
 *   screenshotSource; Twitch at 1280×720). YouTube has no usable live
 *   frame (proved exhaustively — see screenshotSource), so its cards
 *   show the stream's current cover at the highest real tier the
 *   server picked (1280×720 when the stream has one), labelled
 *   直播封面. A plain <img> with object-cover fills the 16:9 card —
 *   no sprite cropping, no percentage-transform geometry (the earlier
 *   storyboard-sprite technique is what shrank YouTube frames into a
 *   corner of the card on mobile WebViews);
 * - first paint prefers the server-stored copy when it is the same
 *   picture (a Twitch frame copy, or the YouTube cover the server
 *   tier-picked into own storage): it loads from this artifact's own
 *   storage even in webviews where the platform CDN is unreachable,
 *   and for YouTube it also guarantees the correct tier — a missing
 *   maxresdefault answers 200 with a 120×90 placeholder, which the
 *   stored copy never is. A Bilibili keyframe has no stored frame
 *   copy, so it paints from the platform URL directly;
 * - real frames re-fetch every 45s while the card is on screen and the
 *   page is in the foreground (cache-busted preload, swapped in only
 *   once loaded). Covers are static and are NOT polled. Cards scrolled
 *   out of view and a backgrounded page stop polling;
 * - a failed fetch keeps the previous picture, so the card never
 *   flashes white mid-stream; a picture that cannot be loaded at all
 *   falls back between the remote URL and the server-stored copy, and
 *   only then to the honest empty state. The avatar is NEVER a
 *   fallback: a portrait is neither a screenshot nor a cover, and an
 *   earlier build's avatar fallback is what left stage cards showing
 *   faces with no screenshot label;
 * - the picture is labelled 实时截图 with the time it was fetched, or
 *   直播封面 when a cover is on show — a cover is never passed off as
 *   a live frame.
 * The whole picture links out to the real stream (App target), exactly
 * like the buttons under the card.
 */
function LiveScreenshot({
  ch,
  name,
  href,
}: {
  ch: Channel;
  name: string;
  href: string;
}) {
  const { ref: wrapRef, inView } = useInView<HTMLDivElement>(0.05);
  const source = screenshotSource(ch);
  const [pageVisible, setPageVisible] = useState<boolean>(
    () => typeof document === "undefined" || document.visibilityState !== "hidden",
  );
  const [updatedAt, setUpdatedAt] = useState<number | null>(null);

  // ---- the one picture mode (frame or cover, per platform) ----
  const direct = source;
  const dBase = direct?.url ?? "";
  const dRealtime = direct?.realtime ?? false;
  const dPoster = direct?.posterUrl ?? "";
  const dPosterIsFrame = direct?.posterIsFrame ?? false;
  // First paint: the server-stored copy when it shows the same picture
  // — a Twitch frame copy (posterIsFrame), or a cover (not realtime:
  // the stored copy is the tier the server verified, while the remote
  // URL can be a 120×90 placeholder for a missing maxres). A Bilibili
  // keyframe is realtime with a cover poster, so it paints remotely.
  // Own storage also paints in sandboxed webviews where the platform
  // CDN is unreachable. The 45s poll below then swaps in fresher
  // external frames for realtime sources.
  const posterFirst = !!dPoster && (dPosterIsFrame || !dRealtime);
  const [dSrc, setDSrc] = useState<string>(() => (posterFirst ? dPoster : dBase));
  const [dFrame, setDFrame] = useState<boolean>(() =>
    posterFirst ? dPosterIsFrame : dRealtime,
  );
  const [dBroken, setDBroken] = useState(false);

  useEffect(() => {
    const pf = !!dPoster && (dPosterIsFrame || !dRealtime);
    setDSrc(pf ? dPoster : dBase);
    setDFrame(pf ? dPosterIsFrame : dRealtime);
    setDBroken(false);
    setUpdatedAt(null);
  }, [dBase, dPoster, dPosterIsFrame, dRealtime]);

  // Poll for a fresh frame only while this card is actually being
  // looked at: inside the viewport AND the page in the foreground.
  // Each fetch goes through the global poll gate (max 4 concurrent),
  // so a screenful of live cards staggers instead of bursting.
  useEffect(() => {
    if (!dRealtime || !dBase || !inView || !pageVisible) return;
    let cancelled = false;
    const timer = window.setInterval(() => {
      void (async () => {
        const release = await acquirePollSlot();
        try {
          if (cancelled) return;
          const next = withBust(dBase, Date.now());
          const probe = new Image();
          probe.onload = () => {
            if (cancelled) return;
            setDSrc(next);
            setDFrame(true);
            setUpdatedAt(Date.now());
            setDBroken(false);
          };
          probe.onerror = () => {
            /* keep the previous frame — never flash or fall back */
          };
          probe.src = next;
        } finally {
          release();
        }
      })();
    }, 45_000);
    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, [dRealtime, dBase, inView, pageVisible]);

  useEffect(() => {
    const onVis = () => setPageVisible(document.visibilityState !== "hidden");
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  const showingFrame = !dBroken && dFrame;
  const hasPicture = !!direct && !dBroken;
  const label = !source || !hasPicture
    ? null
    : showingFrame
      ? `实时截图${updatedAt ? ` · ${fmtClock(updatedAt)} 更新` : ""}`
      : "直播封面 · 非实时画面";

  return (
    <div ref={wrapRef} className="relative aspect-video w-full overflow-hidden bg-black/50">
      {direct && !dBroken ? (
        <a
          href={href}
          target="_blank"
          rel="noreferrer"
          aria-label={`打开 ${name} 的直播（App）`}
          className="block h-full w-full"
        >
          <img
            src={dSrc}
            alt={`${name} 的${dFrame ? "直播实时截图" : "直播封面"}`}
            className="h-full w-full object-cover"
            loading="lazy"
            onLoad={() => setUpdatedAt((t) => t ?? Date.now())}
            onError={() => {
              // A failed picture NEVER swaps in the avatar portrait
              // (that is what left the stage cards showing faces with
              // no label). Fall back between the two copies of the same
              // picture — the remote platform URL and the server-stored
              // copy (a real live frame for Twitch, the stream cover,
              // labelled as such, otherwise) — and only when both are
              // gone, show the honest empty state. Refresh failures
              // never reach here: the preload swap above just keeps
              // the previous frame.
              if (dPoster && dSrc !== dPoster) {
                setDSrc(dPoster);
                setDFrame(dPosterIsFrame);
                setUpdatedAt(null);
              } else if (dBase && dSrc === dPoster && dBase !== dPoster) {
                setDSrc(dBase);
                setDFrame(dRealtime);
                setUpdatedAt(null);
              } else {
                setDBroken(true);
              }
            }}
          />
        </a>
      ) : (
        <div className="flex h-full w-full items-center justify-center text-sm text-[var(--dim)]">
          暂无预览图
        </div>
      )}
      {label && hasPicture && (
        <span className="pointer-events-none absolute bottom-3 left-3 z-20 inline-flex items-center gap-1.5 rounded-full bg-black/65 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-sm">
          {showingFrame && <span className="live-dot h-1.5 w-1.5 rounded-full bg-[#ff2d78]" />}
          {label}
        </span>
      )}
    </div>
  );
}

const StageCard = memo(function StageCard({
  v,
  ch,
  index,
  refreshedAt,
  onHide,
  inAsmrView = false,
}: {
  v: Vtuber;
  ch: Channel;
  index: number;
  refreshedAt: number | null;
  onHide: (v: Vtuber) => void;
  // True while the ASMR filter is on: her card then also states, in
  // words, that this session is NOT ASMR and what it actually is —
  // the whole point of the session-level distinction (an ASMR
  // streamer's game stream must not read as an ASMR stream).
  inAsmrView?: boolean;
}) {
  const tiltRef = useTilt<HTMLDivElement>();
  const { ref: viewRef, inView } = useInView<HTMLDivElement>();
  const { appTarget, webTarget } = watchTargets(ch);
  const hcs = onAirHeadcounts(ch);
  return (
    <div
      id={`stage-card-${ch.channelId}`}
      ref={viewRef}
      data-inview={inView}
      className="cv-stage tilt-scene rise relative w-full min-w-0"
      style={{ "--i": index } as CSSProperties}
    >
      <div className="stage-pedestal" />
      <div
        ref={tiltRef}
        className="tilt-card stage-card holo-flat relative overflow-hidden rounded-[22px]"
      >
        <div className="tilt-shine" />
        <div className="relative">
          <LiveScreenshot ch={ch} name={v.name} href={appTarget} />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/70 to-transparent" />
          <div className="absolute left-3 top-3 flex flex-col items-start gap-1.5">
            <LiveBadge />
            {ch.isAsmr && <AsmrLiveBadge />}
          </div>
          <div className="absolute bottom-3 right-3 flex max-w-[70%] flex-wrap items-center justify-end gap-1.5">
            {hcs.map((hc) => (
              <span
                key={hc.label}
                className="rounded-full bg-black/65 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-sm"
              >
                {hc.label} {hc.value != null ? compactNum.format(hc.value) : "—"}
              </span>
            ))}
            <span className="inline-flex items-center gap-1 rounded-full bg-black/65 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
              <PlatformIcon platform={ch.platform} />
              {PLATFORM_META[ch.platform].label}
            </span>
          </div>
        </div>
        <div className="tilt-inner relative p-4">
          <div className="flex items-start gap-3">
            <Avatar slug={v.slug} name={v.name} size={44} live />
            <div className="min-w-0 flex-1">
              <p className="flex min-w-0 items-baseline gap-2 text-base font-bold leading-snug">
                <span className="truncate">{v.name}</span>
                {v.nameAlt && (
                  <span className="min-w-0 max-w-[46%] truncate text-xs font-medium text-[var(--dim)]">
                    {v.nameAlt}
                  </span>
                )}
              </p>
              <p className="mt-0.5 line-clamp-2 text-sm leading-snug text-[var(--text)]/90">
                {ch.liveTitle || "正在直播"}
              </p>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-1.5 text-xs text-[var(--dim)]">
            {ch.game && (
              <span className="rounded-full border border-[var(--gold)]/40 bg-[var(--gold)]/10 px-2 py-0.5 font-semibold text-[var(--gold)]">
                {ch.game}
              </span>
            )}
            {inAsmrView && !ch.isAsmr && (
              <span className="rounded-full border border-white/20 bg-white/8 px-2 py-0.5 font-semibold text-[var(--text)]/85">
                本场不是 ASMR{ch.game ? ` · 在播 ${ch.game}` : " · 杂谈等其他内容"}
              </span>
            )}
            {ch.startedAt != null && refreshedAt != null && (
              <span>{durationText(ch.startedAt, refreshedAt)}</span>
            )}
            <span>{agencyGroup(v)}</span>
          </div>
          <div className="mt-3.5 flex gap-2">
            <a
              href={appTarget}
              target="_blank"
              rel="noreferrer"
              aria-label={`在 App 里打开 ${v.name} 的直播`}
              className="flex-1 rounded-xl bg-gradient-to-r from-[#8b5cf6] to-[#ff2d78] px-3 py-2.5 text-center text-sm font-bold text-white shadow-[0_10px_24px_-8px_rgba(255,45,120,0.7)] transition-transform active:scale-[0.97]"
            >
              App 看直播
            </a>
            <a
              href={webTarget}
              target="_blank"
              rel="noreferrer"
              aria-label={`在网页打开 ${v.name} 的直播`}
              className="rounded-xl border border-white/20 bg-white/5 px-3.5 py-2.5 text-sm font-semibold text-[var(--text)] transition-transform active:scale-[0.97]"
            >
              网页
            </a>
            <button
              type="button"
              onClick={() => onHide(v)}
              aria-label={`隐藏 ${v.name}（之后可以在页面底部恢复）`}
              className="shrink-0 rounded-xl px-2 py-2.5 text-xs font-medium text-[var(--dim)] underline decoration-dotted underline-offset-4 transition-transform active:scale-95"
            >
              隐藏
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

const PersonCard = memo(function PersonCard({
  v,
  index,
  platformFilter,
  onHide,
  asmrView = false,
}: {
  v: Vtuber;
  index: number;
  platformFilter: Platform | "all";
  onHide: (v: Vtuber) => void;
  // True while the ASMR filter is on: a live-but-not-ASMR session is
  // then labelled as such in words (see StageCard's inAsmrView).
  asmrView?: boolean;
}) {
  // The card's main presentation follows the same featured-stream
  // rule as the stage: with no platform filter, her primary
  // platform's live stream is the one shown when she simulcasts.
  // (Under a platform filter the roster stays person-level, as
  // before: any live stream of hers presents the card.)
  const liveCh =
    platformFilter === "all"
      ? featuredLiveChannel(v, "all")
      : v.channels.find((c) => c.state === "live");
  const chatCh = v.channels.find((c) => c.state === "chat");
  const display =
    liveCh ??
    chatCh ??
    (platformFilter !== "all"
      ? (v.channels.find((c) => c.platform === platformFilter) ?? v.channels[0])
      : v.channels[0]);
  const { ref: viewRef, inView } = useInView<HTMLElement>();
  if (!display) return null;
  const displayHcs = headcounts(display);
  const isLive = display.state === "live";
  const isChat = display.state === "chat";
  // Roster-card two-button rule (user spec, 2026-11-10): 「个人主页」
  // always lands on her profile page, 「直播间」 always lands on her
  // live room — in every state, for every platform. See
  // profileTargetFor / roomTargetFor above for the per-platform
  // targets and why both are canonical https (universal-link) URLs.
  // The two buttons resolve through DIFFERENT channels on purpose:
  // - 「个人主页」 goes through her PRIMARY platform's channel
  //   (v.primaryPlatform, from the server's verified table — e.g.
  //   时雨羽衣 → YouTube, Kaneko Lumi → Twitch, Kson → YouTube),
  //   regardless of which stream is live, which channel is displayed
  //   on the card, or which platform filter is active. The secondary
  //   platform's homepage is not reachable from this button.
  // - 「直播间」 keeps following `display` (the featured / live /
  //   filtered channel), because a live room belongs to the stream
  //   that is actually on.
  // Fallback: primaryPlatform is "" only when she has no channels
  // (already returned above) or, defensively, when no channel matches
  // it — then the displayed channel's profile is used. Single-platform
  // members match trivially (their only channel IS the primary one).
  const profileCh =
    (v.primaryPlatform
      ? v.channels.find((c) => c.platform === v.primaryPlatform)
      : undefined) ?? display;
  const profileUrl = profileTargetFor(profileCh);
  const roomUrl = roomTargetFor(display);
  // Simulcast streams that lost the featured slot do not disappear:
  // each stays listed here on her roster card as its own live link.
  const alsoLive = isLive
    ? v.channels.filter((c) => c.state === "live" && c.channelId !== display.channelId)
    : [];
  return (
    <article
      ref={viewRef}
      data-inview={inView}
      className="cv-person person-card holo-flat rise relative overflow-hidden rounded-[20px] p-4"
      style={{ "--i": index } as CSSProperties}
      aria-label={v.name}
    >
      <div className="flex items-start gap-3">
        <Avatar slug={v.slug} name={v.name} size={52} live={isLive} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <h3 className="text-[17px] font-bold leading-tight">{v.name}</h3>
            {isLive && <LiveBadge small />}
            {isChat && (
              <span className="rounded-full border border-sky-300/40 bg-sky-400/15 px-1.5 py-px text-[10px] font-semibold text-sky-200">
                聊天室
              </span>
            )}
            {display.state === "unknown" && (
              <span className="rounded-full border border-white/15 px-1.5 py-px text-[10px] text-[var(--dim)]">
                状态未知
              </span>
            )}
            {v.tags.includes("ASMR") && (
              <span className="rounded-full border border-violet-300/40 bg-violet-400/15 px-1.5 py-px text-[10px] font-semibold text-violet-200">
                ASMR
              </span>
            )}
          </div>
          <p className="mt-0.5 truncate text-xs text-[var(--dim)]">
            {[v.nameAlt, agencyGroup(v)].filter(Boolean).join(" · ")}
          </p>
          <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
            {v.channels.map((c) => (
              <PlatformChip key={c.channelId} platform={c.platform} />
            ))}
            {display.followersLabel && (
              <span className="text-[11px] text-[var(--dim)]">{display.followersLabel}</span>
            )}
          </div>
        </div>
      </div>

      {isChat ? (
        <div className="mt-3 rounded-xl border border-sky-300/25 bg-sky-400/8 px-3 py-2">
          <p className="line-clamp-2 text-sm font-medium leading-snug">
            {display.liveTitle || "常驻聊天室"}
          </p>
          <p className="mt-1 text-xs text-[var(--dim)]">常驻聊天室开放中 · 不是正式直播，随时能进</p>
        </div>
      ) : isLive ? (
        <>
          <div className="mt-3 overflow-hidden rounded-xl border border-white/10">
            <LiveScreenshot ch={display} name={v.name} href={roomUrl} />
          </div>
          <div className="mt-3 rounded-xl border border-[#ff2d78]/30 bg-[#ff2d78]/8 px-3 py-2">
            {(display.isAsmr || asmrView) && (
              <div className="mb-1.5 flex flex-wrap items-center gap-1.5">
                {display.isAsmr ? (
                  <AsmrLiveBadge small />
                ) : (
                  <span className="rounded-full border border-white/20 bg-white/8 px-2 py-px text-[10px] font-semibold text-[var(--text)]/85">
                    本场不是 ASMR{display.game ? ` · 在播 ${display.game}` : " · 杂谈等其他内容"}
                  </span>
                )}
              </div>
            )}
            <p className="line-clamp-2 text-sm font-medium leading-snug">
              {display.liveTitle || "正在直播"}
            </p>
            <p className="mt-1 flex flex-wrap items-center gap-x-2 text-xs text-[var(--dim)]">
              {display.game && <span className="font-semibold text-[var(--gold)]">{display.game}</span>}
              {displayHcs.map((hc) => (
                <span key={hc.label}>
                  {hc.label} {compactNum.format(hc.value)}
                </span>
              ))}
              <span>点截图去 App 看直播</span>
            </p>
          </div>
        </>
      ) : (
        <p className="mt-3 line-clamp-2 min-h-10 text-sm leading-snug text-[var(--text)]/75">
          {v.reason}
        </p>
      )}

      {alsoLive.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {alsoLive.map((c) => (
            <a
              key={c.channelId}
              href={roomTargetFor(c)}
              target="_blank"
              rel="noreferrer"
              aria-label={`打开 ${v.name} 在 ${PLATFORM_META[c.platform].label} 的另一路直播`}
              className="inline-flex min-h-[28px] items-center gap-1.5 rounded-full border border-[#ff2d78]/35 bg-[#ff2d78]/8 px-2.5 text-[11px] font-medium transition-transform active:scale-95"
            >
              <span className="live-dot h-1.5 w-1.5 shrink-0 rounded-full bg-[#ff2d78]" />
              也在 {PLATFORM_META[c.platform].label} 直播中
              {c.isAsmr ? " · ASMR 直播中" : c.game ? ` · ${c.game}` : ""}
            </a>
          ))}
        </div>
      )}

      <div className="mt-3 flex items-center gap-2">
        <a
          href={profileUrl}
          target="_blank"
          rel="noreferrer"
          aria-label={`打开 ${v.name} 在 ${PLATFORM_META[profileCh.platform].label} 的个人主页`}
          className="flex-1 rounded-lg border border-white/15 bg-white/12 px-3 py-2 text-center text-[13px] font-bold text-white transition-transform active:scale-[0.97]"
        >
          个人主页
        </a>
        <a
          href={roomUrl}
          target="_blank"
          rel="noreferrer"
          aria-label={`打开 ${v.name} 在 ${PLATFORM_META[display.platform].label} 的直播间${isLive ? "（正在直播）" : isChat ? "（聊天室开放中）" : ""}`}
          className={`flex-1 rounded-lg px-3 py-2 text-center text-[13px] font-bold text-white transition-transform active:scale-[0.97] ${
            isLive
              ? "bg-gradient-to-r from-[#8b5cf6] to-[#ff2d78] shadow-[0_8px_20px_-8px_rgba(255,45,120,0.7)]"
              : isChat
                ? "bg-gradient-to-r from-[#38bdf8] to-[#8b5cf6]"
                : "border border-white/15 bg-white/5"
          }`}
        >
          直播间
        </a>
        <button
          type="button"
          onClick={() => onHide(v)}
          aria-label={`隐藏 ${v.name}（之后可以在页面底部恢复）`}
          className="shrink-0 rounded-lg px-2 py-2 text-[12px] font-medium text-[var(--dim)] underline decoration-dotted underline-offset-4 transition-transform active:scale-95"
        >
          隐藏
        </button>
        <span className="ml-auto hidden flex-wrap justify-end gap-1 sm:flex">
          {v.tags.slice(0, 3).map((t) => (
            <span key={t} className="rounded-full bg-white/6 px-1.5 py-0.5 text-[10px] text-[var(--dim)]">
              {t}
            </span>
          ))}
        </span>
      </div>
    </article>
  );
});

function SectionTitle({
  children,
  sub,
  first = false,
}: {
  children: ReactNode;
  sub?: string;
  first?: boolean;
}) {
  // The spot-title sweep is a background-position animation (paint on
  // every frame, never composited). The CSS pause rule keys off a
  // data-inview ancestor, and this root is that ancestor — without it
  // every section title on the page swept forever, on-screen or not,
  // and the rendering pipeline never idled.
  const { ref, inView } = useInView<HTMLDivElement>();
  return (
    <div
      ref={ref}
      data-inview={inView}
      className={`mb-3 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between sm:gap-3 ${
        first ? "mt-1" : "mt-10"
      }`}
    >
      <h2 className="spot-title py-0.5 font-[family-name:var(--font-display)] text-[22px] font-bold leading-[1.3]">
        {children}
      </h2>
      {sub && <p className="text-xs leading-relaxed text-[var(--dim)] sm:pb-1 sm:text-right">{sub}</p>}
    </div>
  );
}

/** Sub-header inside a region section: one agency group, with its headcount. */
function AgencyHeader({
  name,
  count,
  liveCount,
  first = false,
}: {
  name: string;
  count: number;
  liveCount: number;
  first?: boolean;
}) {
  const isIndie = name === "个人势";
  // Same gating as SectionTitle: the live dot in this header pauses
  // while the header is off screen (CSS keys off data-inview).
  const { ref, inView } = useInView<HTMLDivElement>();
  return (
    <div
      ref={ref}
      data-inview={inView}
      className={`mb-3 flex flex-wrap items-center gap-x-2.5 gap-y-1 ${first ? "mt-0" : "mt-7"}`}
    >
      <span
        aria-hidden="true"
        className={`h-4 w-1.5 rounded-full ${
          isIndie
            ? "bg-gradient-to-b from-[#ffb020] to-[#ff2d78]"
            : "bg-gradient-to-b from-[#8b5cf6] to-[#ff2d78]"
        }`}
      />
      <h3
        className={`font-[family-name:var(--font-display)] text-[17px] font-bold leading-snug ${
          isIndie ? "text-[var(--gold)]" : "text-[var(--text)]"
        }`}
      >
        {name}
      </h3>
      <span className="text-xs text-[var(--dim)]">{count} 人</span>
      {liveCount > 0 && (
        <span className="inline-flex items-center gap-1 rounded-full bg-[#ff2d78]/15 px-2 py-px text-[11px] font-semibold text-[#ff7aa8]">
          <span className="live-dot h-1.5 w-1.5 rounded-full bg-[#ff2d78]" />
          {liveCount} 人在播
        </span>
      )}
    </div>
  );
}

export function App() {
  const queryClient = useQueryClient();
  const [gameFilter, setGameFilter] = useState<string | null>(null);
  const [platformFilter, setPlatformFilter] = useState<Platform | "all">("all");
  const [agencyFilter, setAgencyFilter] = useState<string | "all">("all");
  const [asmrOnly, setAsmrOnly] = useState(false);
  const [search, setSearch] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  // Back-to-top floating button: appears only after scrolling about
  // 1.5 viewports down (see the scroll listener below), fixed at the
  // bottom-right above the safe area. It is position:fixed, so its
  // fade in/out never changes layout and cannot make the page jump.
  const [showBackTop, setShowBackTop] = useState(false);
  const scrollerRef = useRef<HTMLElement | null>(null);
  const starsRef = useRef<HTMLDivElement | null>(null);
  const toolbarRef = useRef<HTMLDivElement | null>(null);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<HTMLElement | null>(null);
  const rosterRef = useRef<HTMLDivElement | null>(null);
  const hiddenRef = useRef<HTMLElement | null>(null);
  const { ref: headerRef, inView: headerInView } = useInView<HTMLElement>();

  /**
   * Landing rule (user report, 2026-11-10: 「导航按钮按下去移动端跳转
   * 的位置不清晰」). The old applyFilter guard was the root cause: it
   * CONDITIONALLY scrolled the toolbar into view — sometimes the tap
   * moved the page, sometimes it did not, and when it did the landing
   * was the toolbar itself, not the results. Quick chips therefore
   * felt like they jumped nowhere in particular. The rule is now
   * deterministic and the same for every navigation tap:
   * - NAVIGATION taps (quick chips: ASMR / platform / agency, the
   *   panel's platform / agency / game / ASMR choices, hot-game
   *   cells, ON AIR ticker names) apply their filter AND land on the
   *   one results start — the main-stage section — except ticker
   *   names, which land on that person's stage card, and PLATFORM
   *   choices, which land on the roster list instead (user rule,
   *   2026-11-10: 「平台按钮直接定位到列表，不要定位到 onair 那个
   *   地方，我会自己看」— platform browsing is a roster task; the
   *   user scans the list themselves rather than being dropped on
   *   the live stage). Platform landing uses the exact same
   *   measured-toolbar + gap + verify machinery, only the target
   *   element differs (the roster wrapper).
   * - The landing is computed, never hardcoded: the target's
   *   scroll-margin is set from the sticky toolbar's MEASURED height
   *   at landing time (its height varies — the pills row appears when
   *   filters are active) plus a fixed 10px gap, so the section title
   *   stops exactly under the toolbar: not covered by it, no tail of
   *   the previous section showing, no half-cut card.
   * - The scroll is instant (behavior "auto") and then VERIFIED on
   *   the next frame: if the title's actual top deviates from
   *   (toolbar bottom + gap) by more than 2px — layout shift from the
   *   filter re-render can do that — the real scroller (window or the
   *   app shell's inner container, whichever actually scrolls this
   *   page) is nudged by the exact delta. One correction pass, then
   *   it stays put.
   * - MANAGEMENT taps (the 已选 pills, clear buttons inside the
   *   toolbar) only change state and never move the viewport: the
   *   user is already looking at the toolbar, directly above the
   *   results.
   * What was tapped, what is highlighted, and what is on screen are
   * the same thing by construction: the chip state IS the filter
   * state, and the stage directly under the toolbar renders exactly
   * that filter, its subtitle naming it.
   */
  const LAND_GAP = 10;
  const scrollByDelta = (el: HTMLElement, delta: number) => {
    let node: HTMLElement | null = el.parentElement;
    while (node) {
      if (node.scrollHeight > node.clientHeight + 4) {
        node.scrollTop += delta;
        return;
      }
      node = node.parentElement;
    }
    window.scrollBy(0, delta);
  };
  const scrollToEl = (el: HTMLElement | null) => {
    if (!el) return;
    const tb = toolbarRef.current;
    const margin = tb ? Math.round(tb.getBoundingClientRect().height) + LAND_GAP : LAND_GAP + 2;
    el.style.scrollMarginTop = `${margin}px`;
    el.scrollIntoView({ block: "start", behavior: "auto" });
    requestAnimationFrame(() => {
      const tbNow = toolbarRef.current;
      if (!tbNow) return;
      const desired = tbNow.getBoundingClientRect().bottom + LAND_GAP;
      const delta = Math.round(el.getBoundingClientRect().top - desired);
      if (Math.abs(delta) > 2) scrollByDelta(el, delta);
    });
  };
  /** State-only filter change: never moves the viewport. */
  const applyFilter = (apply: () => void) => {
    apply();
  };
  /** After the next render lands, bring the filtered stage into view. */
  const scrollToStageSoon = () => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => scrollToEl(stageRef.current));
    });
  };
  /** Navigation tap: apply the filter, then land on the results. */
  const applyFilterAndLand = (apply: () => void) => {
    apply();
    scrollToStageSoon();
  };
  /**
   * Panel pick: choosing a filter inside the expanded panel closes
   * the panel first, then lands on the results — the landing is
   * measured against the collapsed toolbar, so the stage title stops
   * in exactly the same place as a quick-chip landing.
   */
  const panelPick = (apply: () => void) => {
    setFilterOpen(false);
    applyFilterAndLand(apply);
  };
  /** After the next render lands, bring the roster list into view. */
  const scrollToRosterSoon = () => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => scrollToEl(rosterRef.current));
    });
  };
  /**
   * Platform tap (quick chips AND the panel's platform options,
   * including toggling a platform off / choosing 全部 in the panel):
   * apply the filter, then land on the TOP OF THE ROSTER LIST —
   * never on the main stage / ON AIR area. Same measured landing as
   * the stage path (sticky toolbar's measured height + the same
   * 10px gap, verified and corrected next frame); only the target
   * differs. Filter logic and the scope line are untouched.
   */
  const applyPlatformAndLand = (apply: () => void) => {
    apply();
    scrollToRosterSoon();
  };
  /** Panel platform pick: close the panel first, then land on the roster. */
  const panelPlatformPick = (apply: () => void) => {
    setFilterOpen(false);
    applyPlatformAndLand(apply);
  };
  /**
   * 「已隐藏」shortcut in the panel's 其他 group (user request,
   * 2026-11-10: scrolling to the bottom by hand is too slow). This
   * is pure NAVIGATION, not a filter: it changes no filter state,
   * never appears in the scope line or the 已选 pills, and leaves no
   * selected state behind. It closes the panel, then SMOOTH-scrolls
   * to the hidden-restore section at the very bottom of the page.
   * The landing reuses the house rule — the section's scroll-margin
   * is the sticky toolbar's measured height + LAND_GAP — but because
   * the scroll is animated, the verify pass waits until the target's
   * position stops moving (content-visibility cards above it settle
   * as they render) and only then nudges by the exact residual
   * delta; at the page bottom that nudge simply clamps, which is
   * the intended "land at the very bottom".
   */
  const goToHidden = () => {
    setFilterOpen(false);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const el = hiddenRef.current;
        if (!el) return;
        const tb = toolbarRef.current;
        const margin = tb ? Math.round(tb.getBoundingClientRect().height) + LAND_GAP : LAND_GAP + 2;
        el.style.scrollMarginTop = `${margin}px`;
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        el.scrollIntoView({ block: "start", behavior: reduce ? "auto" : "smooth" });
        let lastTop = el.getBoundingClientRect().top;
        let stableFrames = 0;
        let frames = 0;
        const settleCheck = () => {
          frames += 1;
          const top = el.getBoundingClientRect().top;
          if (Math.abs(top - lastTop) < 1) {
            stableFrames += 1;
          } else {
            stableFrames = 0;
            lastTop = top;
          }
          if (stableFrames >= 3 || frames > 300) {
            const tbNow = toolbarRef.current;
            if (!tbNow) return;
            const desired = tbNow.getBoundingClientRect().bottom + LAND_GAP;
            const delta = Math.round(el.getBoundingClientRect().top - desired);
            if (Math.abs(delta) > 2) scrollByDelta(el, delta);
            return;
          }
          requestAnimationFrame(settleCheck);
        };
        requestAnimationFrame(settleCheck);
      });
    });
  };
  /** ON AIR ticker tap: jump straight to that person's stage card. */
  const jumpToStageCard = (channelId: number) => {
    scrollToEl(document.getElementById(`stage-card-${channelId}`));
  };

  /**
   * Search typing is a filter change too, but it used to bypass every
   * positioning guard — setSearch ran bare on each keystroke. On a
   * phone the user often types from deep in the roster (the toolbar
   * sticks, so the box is right there); as the matches narrow, the
   * document collapses to a fraction of its height, the browser
   * clamps the scroll to wherever the shrunken page ends, and the
   * view lands mid-results — probe-measured: the stage heading ended
   * up hidden behind the sticky toolbar and the one matched card sat
   * below an unrelated section. So after each change, once the new
   * layout has landed, if the top of the results (the stage heading)
   * sits above the toolbar's bottom edge — covered by it, or scrolled
   * past entirely — bring the results start back under the toolbar
   * through the same scrollToEl the game chips land with. When the
   * user is at the page top the heading already sits below the
   * toolbar, the check fails, and typing never moves the view.
   */
  const handleSearchChange = (value: string) => {
    setSearch(value);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const stage = stageRef.current;
        const tb = toolbarRef.current;
        if (!stage || !tb) return;
        const stageTop = stage.getBoundingClientRect().top;
        const toolbarBottom = tb.getBoundingClientRect().bottom;
        if (stageTop < toolbarBottom - 4) scrollToEl(stage);
      });
    });
  };

  const board = useQuery({
    queryKey: ["board"],
    queryFn: () => api.getBoard({}),
    refetchInterval: 120_000,
  });

  const refresh = useMutation({
    mutationFn: () => api.refreshLive({}),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["board"] }),
  });

  const setHidden = useMutation({
    mutationFn: (args: { slug: string; hidden: boolean }) => api.setHidden(args),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["board"] }),
  });
  // Stable identities so the memoized cards below actually skip
  // re-renders: an inline arrow here would hand every card a new
  // onHide on every App render (header leaving the viewport, the
  // back-to-top threshold, each search keystroke) and defeat the memo.
  const hidePerson = useCallback(
    (v: Vtuber) => setHidden.mutate({ slug: v.slug, hidden: true }),
    [setHidden],
  );
  const restorePerson = useCallback(
    (v: Vtuber) => setHidden.mutate({ slug: v.slug, hidden: false }),
    [setHidden],
  );

  // Gentle starfield parallax on scroll (0.16 factor, 56px cap).
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const el = starsRef.current;
        if (el) {
          const y = Math.min(56, window.scrollY * 0.16);
          el.style.transform = `translateY(${y.toFixed(1)}px)`;
        }
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  // Back-to-top visibility: listen in the capture phase so the
  // listener sees scrolls of whichever ancestor actually scrolls this
  // page (the window, or the app shell's inner container — both
  // models exist, see the landing notes above). Threshold is ~1.5
  // viewport heights: at the top the button stays hidden and out of
  // the way; deep in the roster it fades in. It also remembers the
  // scroller element so the click can smooth-scroll THAT element
  // back to its top.
  useEffect(() => {
    const onScroll = (e: Event) => {
      const t = e.target;
      let y = window.scrollY;
      if (t instanceof HTMLElement && t.scrollTop > 0) {
        y = t.scrollTop;
        scrollerRef.current = t;
      } else if (t === document) {
        y = window.scrollY;
        scrollerRef.current = null;
      }
      setShowBackTop(y > window.innerHeight * 1.5);
    };
    window.addEventListener("scroll", onScroll, { capture: true, passive: true });
    return () => window.removeEventListener("scroll", onScroll, { capture: true });
  }, []);

  const backToTop = () => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const behavior: ScrollBehavior = reduce ? "auto" : "smooth";
    const scroller = scrollerRef.current;
    if (scroller && scroller.scrollTop > 0) {
      scroller.scrollTo({ top: 0, behavior });
    } else {
      window.scrollTo({ top: 0, behavior });
    }
  };

  const data = board.data;
  const query = search.trim().toLowerCase();
  const matchesSearch = (v: Vtuber) =>
    !query ||
    v.name.toLowerCase().includes(query) ||
    v.nameAlt.toLowerCase().includes(query) ||
    v.agency.toLowerCase().includes(query) ||
    agencyGroup(v).toLowerCase().includes(query) ||
    v.tags.some((t) => t.toLowerCase().includes(query));
  // One predicate for ALL five dimensions — search, platform, agency,
  // ASMR, and (for the roster) game — applied identically to the live
  // stage and the roster below, so a filter means the same thing
  // everywhere on the page.
  const passesContent = (v: Vtuber) =>
    !v.hidden &&
    (agencyFilter === "all" || agencyGroup(v) === agencyFilter) &&
    (platformFilter === "all" ||
      v.channels.some((c) => c.platform === platformFilter)) &&
    (!asmrOnly || v.tags.includes("ASMR")) &&
    matchesSearch(v);

  const liveItems = useMemo(() => {
    if (!data) return [];
    const items: { v: Vtuber; ch: Channel }[] = [];
    for (const v of data.vtubers) {
      if (!passesContent(v)) continue;
      // One person, one stage card: featuredLiveChannel picks her
      // primary platform's stream when she is live on several
      // platforms at once (the non-featured streams stay reachable
      // from her roster card). Under a platform filter it returns
      // only that platform's live channel — the person-level
      // predicate alone would leak: someone can hold a YouTube
      // channel yet be live right now on Twitch or Bilibili, and her
      // card must not show under the YouTube filter.
      const ch = featuredLiveChannel(v, platformFilter);
      if (ch) items.push({ v, ch });
    }
    items.sort((a, b) => compareOnAir(a.ch, b.ch));
    // In the ASMR view the session distinction leads: streamers
    // whose CURRENT session is ASMR sort above ASMR-roster members
    // who are live with something else (the stage below also renders
    // them as two labelled groups). Within each group the ON AIR
    // ranking applies (one mixed ranking by real concurrents).
    if (asmrOnly) {
      items.sort(
        (a, b) =>
          Number(b.ch.isAsmr) - Number(a.ch.isAsmr) ||
          compareOnAir(a.ch, b.ch),
      );
    }
    return gameFilter ? items.filter((i) => i.ch.game === gameFilter) : items;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, gameFilter, asmrOnly, query, agencyFilter, platformFilter]);

  const visibleByRegion = useMemo(() => {
    const map = new Map<Region, Vtuber[]>();
    if (!data) return map;
    for (const r of REGIONS) map.set(r.key, []);
    for (const v of data.vtubers) {
      if (!passesContent(v)) continue;
      // The game dimension judges the same featured stream the stage
      // pushes (her primary platform's when she simulcasts), so the
      // roster and the stage never disagree about who plays what.
      if (gameFilter && featuredLiveChannel(v, platformFilter)?.game !== gameFilter) continue;
      map.get(v.region)?.push(v);
    }
    return map;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, platformFilter, gameFilter, asmrOnly, query, agencyFilter]);

  // 社团筛选条目：按未隐藏总人数降序，「个人势」作为正式大类单列，
  // 人数照常计入，和企业势并列排序。
  const agencyStats = useMemo(() => {
    const counts = new Map<string, number>();
    if (!data) return [] as { name: string; count: number }[];
    for (const v of data.vtubers) {
      if (v.hidden) continue;
      const g = agencyGroup(v);
      counts.set(g, (counts.get(g) ?? 0) + 1);
    }
    return [...counts.entries()]
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => {
        if (a.name === "个人势") return -1;
        if (b.name === "个人势") return 1;
        return b.count - a.count || a.name.localeCompare(b.name);
      });
  }, [data]);

  // The badge on the 筛选 button counts only the panel dimensions
  // (game / platform / agency / ASMR). The search keyword is not
  // counted: it lives in its own always-visible box, not in the panel.
  const activeFilterCount =
    (gameFilter ? 1 : 0) +
    (platformFilter !== "all" ? 1 : 0) +
    (agencyFilter !== "all" ? 1 : 0) +
    (asmrOnly ? 1 : 0);
  // Quick-row agencies: the top 6 by size — plus the currently selected
  // agency pinned in front when it is not one of the six, so the active
  // choice is always visible in the bar itself.
  const quickAgencies = (() => {
    const top = agencyStats.slice(0, 6);
    if (
      agencyFilter !== "all" &&
      !top.some((a) => a.name === agencyFilter)
    ) {
      const sel = agencyStats.find((a) => a.name === agencyFilter);
      if (sel) return [sel, ...top];
    }
    return top;
  })();
  const visibleCount = [...visibleByRegion.values()].reduce(
    (n, list) => n + list.length,
    0,
  );
  const scopeParts = [
    platformFilter !== "all" ? PLATFORM_META[platformFilter].label : null,
    agencyFilter !== "all" ? agencyFilter : null,
    gameFilter ? `游戏「${gameFilter}」` : null,
    asmrOnly ? "ASMR" : null,
    query ? `搜索「${search.trim()}」` : null,
  ].filter((p): p is string => p != null);
  const clearAllFilters = () =>
    applyFilter(() => {
      setGameFilter(null);
      setPlatformFilter("all");
      setAgencyFilter("all");
      setAsmrOnly(false);
      setSearch("");
    });

  const hiddenList = useMemo(
    () => (data ? data.vtubers.filter((v) => v.hidden) : []),
    [data],
  );
  const anyVisible =
    visibleByRegion.size > 0 &&
    [...visibleByRegion.values()].some((list) => list.length > 0);

  return (
    <div ref={rootRef} className="relative min-h-screen">
      <div className="stage-bg" />
      <div ref={starsRef} className="stage-stars" />
      <div className="stage-floor" />

      {/* status header: plain flow. It scrolls away with the page —
          nothing at the top of the screen changes height while the user
          scrolls, so the content under the finger never shifts. Only the
          filter toolbar below is sticky. (The previous sticky +
          scroll-aware collapsing header animated its own height mid-
          scroll; the page grew/shrank under the finger and the browser
          clamped the scroll position — the reported jumping.) */}
      <header
        ref={headerRef}
        data-inview={headerInView}
        className="border-b border-white/8 bg-[#0d0a1f]/60 pt-safe"
      >
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
          <span className="relative flex h-3 w-3 shrink-0">
            <span className="live-dot absolute inline-flex h-full w-full rounded-full bg-[#ff2d78]" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="font-[family-name:var(--font-display)] text-lg font-bold leading-tight">
              ON AIR{" "}
              <span className="bg-gradient-to-r from-[#c4b5fd] to-[#ff5e8a] bg-clip-text text-transparent">
                {data ? (scopeParts.length > 0 ? liveItems.length : data.liveCount) : "–"}
              </span>
              <span className="ml-2 align-middle text-xs font-medium text-[var(--dim)]">
                {scopeParts.length > 0 ? "当前筛选下在播" : "正在直播"}
              </span>
            </p>
            <p className="mt-1 truncate text-[11px] text-[var(--dim)]">
              {data?.refreshedAt
                ? `更新于 ${fmtTime(data.refreshedAt)} (JST) · 每 15 分钟自动刷新`
                : "尚未刷新，点右侧按钮获取最新状态"}
              {data && scopeParts.length > 0 ? ` · 未筛选共 ${data.liveCount} 人在播` : ""}
            </p>
          </div>
          <button
            type="button"
            onClick={() => refresh.mutate()}
            disabled={refresh.isPending}
            aria-label="立即刷新直播状态"
            className="shrink-0 rounded-full bg-gradient-to-r from-[#8b5cf6] to-[#ff2d78] px-4 py-2 text-sm font-bold text-white shadow-[0_8px_20px_-6px_rgba(255,45,120,0.65)] transition-transform active:scale-95 disabled:opacity-60"
          >
            {refresh.isPending ? "刷新中…" : "刷新"}
          </button>
        </div>
        {/* ON AIR ticker: a compact index of who is live UNDER THE
            CURRENT FILTER (built from the same liveItems as the stage —
            pick a game and this strip shrinks to that game's streamers
            too; it is never a second, unfiltered set of cards). Tapping
            a name jumps to that person's one stage card below. */}
        {data && liveItems.length > 0 && (
          <div className="mx-auto max-w-6xl px-4 pb-3">
            <div
              className="no-scrollbar -mx-4 flex items-center gap-1.5 overflow-x-auto px-4"
              role="group"
              aria-label="在播速览（点名字跳到主舞台的卡片）"
            >
              <span className="shrink-0 text-[11px] font-semibold text-[var(--dim)]">
                在播速览
              </span>
              {liveItems.map(({ v, ch }) => (
                <button
                  key={ch.channelId}
                  type="button"
                  onClick={() => jumpToStageCard(ch.channelId)}
                  aria-label={`跳到主舞台：${v.name} 的直播卡片`}
                  className="inline-flex min-h-[32px] shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border border-white/12 bg-white/5 px-2.5 text-xs font-medium transition-transform active:scale-95"
                >
                  <span className="live-dot h-1.5 w-1.5 shrink-0 rounded-full bg-[#ff2d78]" />
                  {v.name}
                  {ch.isAsmr && (
                    <span className="shrink-0 font-bold text-violet-300">ASMR 直播中</span>
                  )}
                  {ch.game && (
                    <span className="max-w-32 truncate font-semibold text-[var(--gold)]">
                      {ch.game}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </header>

      <main className="mx-auto max-w-6xl px-4 pb-14 pt-3">
        {board.isPending && (
          <div className="py-16 text-center" role="status">
            <div className="floaty mx-auto mb-4 h-14 w-14 rounded-full avatar-ring p-[3px]">
              <div className="flex h-full w-full items-center justify-center rounded-full bg-[var(--surface)] font-[family-name:var(--font-display)] text-xl font-bold">
                V
              </div>
            </div>
            <p className="text-sm text-[var(--dim)]">舞台布光中…</p>
          </div>
        )}

        {board.error && (
          <div className="py-16 text-center">
            <p className="text-sm text-[var(--dim)]">看板加载失败，网络可能不稳。</p>
            <button
              type="button"
              onClick={() => board.refetch()}
              aria-label="重试加载看板"
              className="mt-4 rounded-full border border-white/20 bg-white/5 px-5 py-2 text-sm font-semibold"
            >
              重试
            </button>
          </div>
        )}

        {data && (
          <>
            {/* sticky filter toolbar: search + one-row quick chips + panel.
                Everything filter-related lives here, at the top, so on a
                phone any agency / ASMR / platform filter is ≤2 taps away
                and the bar never scrolls off or overlaps section titles. */}
            {/* The bar used to be bg/88 + backdrop-blur-xl: a full-width
                backdrop blur whose backdrop (the scrolling page) changes
                on every scroll frame — a permanent re-blur for as long
                as the user browses, and a top mobile-heat suspect. At
                88% opacity over a 24px blur the content underneath was
                already an illegible smudge; the pre-composited /97
                deep-space bar reads the same and costs nothing per
                frame. */}
            <div
              ref={toolbarRef}
              style={{ paddingTop: "calc(env(safe-area-inset-top, 0px) + 8px)" }}
              className="sticky top-0 z-20 -mx-4 border-b border-white/8 bg-[#0d0a1f]/97 px-4 pb-2"
            >
              <div className="flex items-center gap-2">
                {/* the search input is text-base (16px) on purpose: below
                    16px, iOS Safari auto-zooms the page when the field
                    gains focus and leaves it zoomed/shifted afterwards —
                    the other half of the "search results land in the
                    wrong place" report on phones */}
                <label htmlFor="vtuber-search" className="sr-only">
                  搜索主播（名字、别名、事务所或标签）
                </label>
                <input
                  id="vtuber-search"
                  type="search"
                  value={search}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  placeholder="搜人：名字 / 别名 / 社团 / 标签"
                  className="holo-flat min-h-[44px] min-w-0 flex-1 rounded-2xl px-4 py-2.5 text-base text-[var(--text)] placeholder:text-[var(--dim)] focus:outline-none focus:ring-2 focus:ring-[#8b5cf6]/60"
                />
                <button
                  type="button"
                  onClick={() => setFilterOpen(!filterOpen)}
                  aria-expanded={filterOpen}
                  aria-label={filterOpen ? "收起筛选面板" : "展开筛选面板（平台和全部社团）"}
                  className={`inline-flex min-h-[44px] shrink-0 items-center gap-1.5 rounded-2xl border px-4 text-sm font-bold transition-transform active:scale-95 ${
                    filterOpen || activeFilterCount > 0
                      ? "chip-on"
                      : "border-white/15 bg-white/5 text-[var(--text)]"
                  }`}
                >
                  筛选
                  {activeFilterCount > 0 && (
                    <span className="rounded-full bg-white/25 px-1.5 py-px text-[11px] font-bold leading-tight">
                      {activeFilterCount}
                    </span>
                  )}
                  <svg width="12" height="12" viewBox="0 0 24 24" aria-hidden="true" className={`transition-transform ${filterOpen ? "rotate-180" : ""}`}>
                    <path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                </button>
              </div>

              {/* quick chips: ONE horizontally scrolling row, 40px+ targets */}
              <div
                className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 pt-2"
                role="group"
                aria-label="快捷筛选"
              >
                <button
                  type="button"
                  onClick={() => applyFilterAndLand(() => setAsmrOnly(!asmrOnly))}
                  aria-pressed={asmrOnly}
                  aria-label="只看经常做 ASMR 的主播"
                  className={`inline-flex min-h-[40px] shrink-0 items-center whitespace-nowrap rounded-full border px-3.5 text-[13px] font-semibold transition-transform active:scale-95 ${
                    asmrOnly ? "chip-on" : "border-violet-300/35 bg-violet-400/10 text-violet-100"
                  }`}
                >
                  ASMR
                </button>
                {(
                  [
                    { key: "youtube", label: "YouTube" },
                    { key: "twitch", label: "Twitch" },
                    { key: "bilibili", label: "Bilibili" },
                  ] as { key: Platform; label: string }[]
                ).map((f) => {
                  const on = platformFilter === f.key;
                  return (
                    <button
                      key={f.key}
                      type="button"
                      onClick={() =>
                        applyPlatformAndLand(() => setPlatformFilter(on ? "all" : f.key))
                      }
                      aria-pressed={on}
                      aria-label={`平台筛选：${f.label}`}
                      className={`inline-flex min-h-[40px] shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border px-3.5 text-[13px] font-semibold transition-transform active:scale-95 ${
                        on ? "chip-on" : "border-white/15 bg-white/5 text-[var(--text)]"
                      }`}
                    >
                      <PlatformIcon platform={f.key} />
                      {f.label}
                    </button>
                  );
                })}
                {quickAgencies.map(({ name, count }) => {
                  const on = agencyFilter === name;
                  const isIndie = name === "个人势";
                  return (
                    <button
                      key={name}
                      type="button"
                      onClick={() =>
                        applyFilterAndLand(() => setAgencyFilter(on ? "all" : name))
                      }
                      aria-pressed={on}
                      aria-label={`社团筛选：${name}，共 ${count} 人`}
                      className={`inline-flex min-h-[40px] shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border px-3.5 text-[13px] font-semibold transition-transform active:scale-95 ${
                        on
                          ? "chip-on"
                          : isIndie
                            ? "border-[var(--gold)]/50 bg-[var(--gold)]/12 text-[#ffd98a]"
                            : "border-white/15 bg-white/5 text-[var(--text)]"
                      }`}
                    >
                      {name}
                      <span className={`text-[11px] ${on ? "text-white/85" : "text-[var(--dim)]"}`}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* current scope + result counts: what the five filters
                  are doing, stated in one always-visible line */}
              <p className="pt-1.5 text-[11px] leading-relaxed text-[var(--dim)]" role="status">
                {scopeParts.length > 0
                  ? `当前范围：${scopeParts.join(" + ")}（同时满足）`
                  : "当前范围：全部"}
                {` · 共 ${visibleCount} 人 · ${liveItems.length} 人在播`}
              </p>

              {/* active filter pills + one-tap clear-all */}
              {activeFilterCount > 0 && (
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[11px] font-semibold text-[var(--dim)]">已选</span>
                  {gameFilter && (
                    <button
                      type="button"
                      onClick={() => applyFilter(() => setGameFilter(null))}
                      aria-label={`移除游戏筛选 ${gameFilter}`}
                      className="rounded-full bg-[#ffb020]/20 px-2.5 py-1 text-[11px] font-semibold text-[var(--gold)]"
                    >
                      游戏：{gameFilter} ×
                    </button>
                  )}
                  {platformFilter !== "all" && (
                    <button
                      type="button"
                      onClick={() => applyFilter(() => setPlatformFilter("all"))}
                      aria-label="移除平台筛选"
                      className="rounded-full bg-white/12 px-2.5 py-1 text-[11px] font-semibold text-[var(--text)]"
                    >
                      {PLATFORM_META[platformFilter].label} ×
                    </button>
                  )}
                  {agencyFilter !== "all" && (
                    <button
                      type="button"
                      onClick={() => applyFilter(() => setAgencyFilter("all"))}
                      aria-label="移除社团筛选"
                      className="rounded-full bg-white/12 px-2.5 py-1 text-[11px] font-semibold text-[var(--text)]"
                    >
                      社团：{agencyFilter} ×
                    </button>
                  )}
                  {asmrOnly && (
                    <button
                      type="button"
                      onClick={() => applyFilter(() => setAsmrOnly(false))}
                      aria-label="移除 ASMR 筛选"
                      className="rounded-full bg-violet-400/25 px-2.5 py-1 text-[11px] font-semibold text-violet-100"
                    >
                      ASMR ×
                    </button>
                  )}
                  {query && (
                    <button
                      type="button"
                      onClick={() => handleSearchChange("")}
                      aria-label="清除搜索关键词"
                      className="rounded-full bg-white/12 px-2.5 py-1 text-[11px] font-semibold text-[var(--text)]"
                    >
                      搜索：{search.trim()} ×
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={clearAllFilters}
                    aria-label="清除全部筛选条件"
                    className="rounded-full border border-[#ff2d78]/50 bg-[#ff2d78]/15 px-2.5 py-1 text-[11px] font-bold text-[#ff8fb5]"
                  >
                    全部清除
                  </button>
                </div>
              )}

              {/* expandable panel: full platform + agency lists */}
              {filterOpen && (
                <div className="mt-2 max-h-[46vh] overflow-y-auto rounded-2xl border border-white/10 bg-white/[0.03] p-3">
                  <p className="text-[11px] leading-relaxed text-[var(--dim)]">
                    搜索、平台、社团、游戏、ASMR 五个条件同时生效（要同时满足），主舞台和下方名册一起筛；再点一次已选项就取消它。
                  </p>
                  <p className="mt-2.5 text-[11px] font-semibold text-[var(--dim)]">平台</p>
                  <div className="mt-1.5 grid grid-cols-4 gap-2" role="group" aria-label="按平台筛选（面板）">
                    {(
                      [
                        { key: "all", label: "全部" },
                        { key: "youtube", label: "YouTube" },
                        { key: "twitch", label: "Twitch" },
                        { key: "bilibili", label: "Bilibili" },
                      ] as { key: Platform | "all"; label: string }[]
                    ).map((f) => {
                      const on = platformFilter === f.key;
                      return (
                        <button
                          key={f.key}
                          type="button"
                          onClick={() => panelPlatformPick(() => setPlatformFilter(f.key))}
                          aria-pressed={on}
                          aria-label={`平台筛选：${f.label}`}
                          className={`min-h-[40px] rounded-xl border px-1 text-[12px] font-semibold transition-transform active:scale-95 ${
                            on ? "chip-on" : "border-white/15 bg-white/5 text-[var(--text)]"
                          }`}
                        >
                          {f.label}
                        </button>
                      );
                    })}
                  </div>
                  <p className="mt-3.5 text-[11px] font-semibold text-[var(--dim)]">
                    社团（点一个只看这家，再点一次取消）
                  </p>
                  <div className="mt-1.5 flex flex-wrap gap-2" role="group" aria-label="按社团筛选（面板）">
                    <button
                      type="button"
                      onClick={() => panelPick(() => setAgencyFilter("all"))}
                      aria-pressed={agencyFilter === "all"}
                      aria-label="社团筛选：全部社团"
                      className={`inline-flex min-h-[40px] items-center rounded-full border px-3.5 text-[13px] font-semibold transition-transform active:scale-95 ${
                        agencyFilter === "all" ? "chip-on" : "border-white/15 bg-white/5 text-[var(--text)]"
                      }`}
                    >
                      全部社团
                    </button>
                    {agencyStats.map(({ name, count }) => {
                      const on = agencyFilter === name;
                      const isIndie = name === "个人势";
                      return (
                        <button
                          key={name}
                          type="button"
                          onClick={() =>
                            panelPick(() => setAgencyFilter(on ? "all" : name))
                          }
                          aria-pressed={on}
                          aria-label={`社团筛选：${name}，共 ${count} 人`}
                          className={`inline-flex min-h-[40px] items-center gap-1.5 rounded-full border px-3.5 text-[13px] font-semibold transition-transform active:scale-95 ${
                            on
                              ? "chip-on"
                              : isIndie
                                ? "border-[var(--gold)]/50 bg-[var(--gold)]/12 text-[#ffd98a]"
                                : "border-white/15 bg-white/5 text-[var(--text)]"
                          }`}
                        >
                          {name}
                          <span className={`text-[11px] ${on ? "text-white/85" : "text-[var(--dim)]"}`}>
                            {count}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                  {data.games.length > 0 && (
                    <>
                      <p className="mt-3.5 text-[11px] font-semibold text-[var(--dim)]">
                        游戏（此刻有人在播的；和下方热播榜是同一个条件）
                      </p>
                      <div className="mt-1.5 flex flex-wrap gap-2" role="group" aria-label="按游戏筛选（面板）">
                        <button
                          type="button"
                          onClick={() => panelPick(() => setGameFilter(null))}
                          aria-pressed={gameFilter === null}
                          aria-label="游戏筛选：全部游戏"
                          className={`inline-flex min-h-[40px] items-center rounded-full border px-3.5 text-[13px] font-semibold transition-transform active:scale-95 ${
                            gameFilter === null ? "chip-on" : "border-white/15 bg-white/5 text-[var(--text)]"
                          }`}
                        >
                          全部游戏
                        </button>
                        {data.games.map((g) => {
                          const on = gameFilter === g.name;
                          return (
                            <button
                              key={g.name}
                              type="button"
                              onClick={() => panelPick(() => setGameFilter(on ? null : g.name))}
                              aria-pressed={on}
                              aria-label={`游戏筛选：${g.name}，${g.streamers.length} 人在播`}
                              className={`inline-flex min-h-[40px] max-w-full items-center gap-1.5 rounded-full border px-3.5 text-[13px] font-semibold transition-transform active:scale-95 ${
                                on ? "chip-on" : "border-white/15 bg-white/5 text-[var(--text)]"
                              }`}
                            >
                              <span className="truncate">{g.name}</span>
                              <span className={`shrink-0 text-[11px] ${on ? "text-white/85" : "text-[var(--dim)]"}`}>
                                {g.streamers.length} 人在播
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </>
                  )}
                  <p className="mt-3.5 text-[11px] font-semibold text-[var(--dim)]">其他</p>
                  <div className="mt-1.5 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => panelPick(() => setAsmrOnly(!asmrOnly))}
                      aria-pressed={asmrOnly}
                      aria-label="只看经常做 ASMR 的主播（面板）"
                      className={`inline-flex min-h-[40px] items-center rounded-full border px-3.5 text-[13px] font-semibold transition-transform active:scale-95 ${
                        asmrOnly ? "chip-on" : "border-violet-300/35 bg-violet-400/10 text-violet-100"
                      }`}
                    >
                      ASMR
                    </button>
                    <button
                      type="button"
                      onClick={goToHidden}
                      aria-label={`跳到页面最下方的已隐藏区，当前已隐藏 ${hiddenList.length} 人`}
                      className="inline-flex min-h-[40px] items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3.5 text-[13px] font-semibold text-[var(--text)] transition-transform active:scale-95"
                    >
                      已隐藏
                      <span className="text-[11px] text-[var(--dim)]">{hiddenList.length} 人</span>
                    </button>
                  </div>
                  {activeFilterCount > 0 && (
                    <button
                      type="button"
                      onClick={() => panelPick(() => clearAllFilters())}
                      aria-label="清除全部筛选条件"
                      className="mt-3.5 w-full rounded-xl border border-[#ff2d78]/50 bg-[#ff2d78]/15 py-2.5 text-sm font-bold text-[#ff8fb5] transition-transform active:scale-[0.98]"
                    >
                      清除全部筛选
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* main stage: live now — the landing place for filter
                results and ticker jumps, EXCEPT platform choices,
                which land on the roster list below (user rule) */}
            <section aria-label="正在直播" ref={stageRef}>
              <SectionTitle
                first
                sub={
                  asmrOnly && liveItems.length > 0
                    ? `${liveItems.filter((i) => i.ch.isAsmr).length} 人正在播 ASMR · ${liveItems.filter((i) => !i.ch.isAsmr).length} 人在播其他内容`
                    : scopeParts.length > 0
                      ? `当前筛选：${scopeParts.join(" · ")}`
                      : "谁在播谁上台"
                }
              >
                主舞台 · 正在直播
              </SectionTitle>
              {liveItems.length === 0 ? (
                <div className="holo-flat rounded-[20px] px-5 py-7 text-center">
                  <p className="text-sm leading-relaxed text-[var(--text)]/85">
                    {gameFilter
                      ? `现在没人在播「${gameFilter}」。换个游戏，或者清掉筛选看看。`
                      : data.refreshedAt
                        ? "这一刻名单里没人开播。过会儿刷新再来，或者先去下面逛逛频道。"
                        : "还没刷新过。点右上角「刷新」，马上看谁在播。"}
                  </p>
                  {gameFilter && (
                    <button
                      type="button"
                      onClick={() => applyFilter(() => setGameFilter(null))}
                      aria-label="清除游戏筛选"
                      className="mt-3 rounded-full border border-white/20 bg-white/5 px-4 py-1.5 text-xs font-semibold"
                    >
                      清除游戏筛选
                    </button>
                  )}
                </div>
              ) : asmrOnly ? (
                // ASMR view: two labelled groups, real ASMR sessions
                // first — one glance separates "she is doing ASMR
                // now" from "an ASMR streamer who is live with a
                // game / talk session instead" (their cards name
                // this session's actual content).
                <>
                  {[
                    {
                      key: "asmr-live",
                      label: "正在播 ASMR",
                      items: liveItems
                        .map((item, idx) => ({ ...item, idx }))
                        .filter((i) => i.ch.isAsmr),
                    },
                    {
                      key: "live-not-asmr",
                      label: "在播，但本场不是 ASMR",
                      items: liveItems
                        .map((item, idx) => ({ ...item, idx }))
                        .filter((i) => !i.ch.isAsmr),
                    },
                  ]
                    .filter((g) => g.items.length > 0)
                    .map((g, gi) => (
                      <div key={g.key}>
                        <p
                          className={`mb-3 flex items-center gap-2 text-sm font-bold ${gi === 0 ? "" : "mt-6"} ${g.key === "asmr-live" ? "text-violet-200" : "text-[var(--dim)]"}`}
                        >
                          {g.key === "asmr-live" && (
                            <span className="live-dot h-2 w-2 rounded-full bg-[#ff2d78]" />
                          )}
                          {g.label}
                          <span className="text-xs font-semibold text-[var(--dim)]">
                            {g.items.length} 人
                          </span>
                        </p>
                        <div className="grid grid-cols-1 gap-6 pb-4 sm:grid-cols-2 lg:grid-cols-3">
                          {g.items.map(({ v, ch, idx }) => (
                            <StageCard
                              key={ch.channelId}
                              v={v}
                              ch={ch}
                              index={idx}
                              refreshedAt={data.refreshedAt}
                              onHide={hidePerson}
                              inAsmrView
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                </>
              ) : (
                <div className="grid grid-cols-1 gap-6 pb-4 sm:grid-cols-2 lg:grid-cols-3">
                  {liveItems.map(({ v, ch }, i) => (
                    <StageCard
                      key={ch.channelId}
                      v={v}
                      ch={ch}
                      index={i}
                      refreshedAt={data.refreshedAt}
                      onHide={hidePerson}
                    />
                  ))}
                </div>
              )}
            </section>

            {/* hot games: two-column grid on phones (one game per cell,
                fixed cell geometry so long names truncate inside the
                cell instead of stretching the row), wider grids above.
                The old content-sized flex-wrap chips wrapped raggedly —
                a long English title took a whole row, short ones packed
                two or three — and the streamer line was hard-capped at
                224px, so the board read as scattered fragments.
                Tapping a game SELECTS it and lands on the main stage
                (the one place filtered live cards live); tapping the
                selected game again clears it and stays here. */}
            <section aria-label="热播游戏">
              <SectionTitle sub="来自此刻在播的直播间 · 点一个跳到主舞台只看它">
                热播游戏 · 点一个只看它
              </SectionTitle>
              {data.games.length === 0 ? (
                <p className="holo-flat rounded-[20px] px-5 py-5 text-sm text-[var(--text)]/85">
                  {data.refreshedAt
                    ? "当前在播的直播间没有可汇总的游戏信息（杂谈/歌回为主，或游戏名没抓到）。"
                    : "刷新一次后，这里会汇总大家正在玩的游戏。"}
                </p>
              ) : (
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
                  {data.games.map((g, i) => {
                    const on = gameFilter === g.name;
                    return (
                      <button
                        key={g.name}
                        type="button"
                        onClick={() => {
                          if (on) {
                            applyFilter(() => setGameFilter(null));
                          } else {
                            setGameFilter(g.name);
                            scrollToStageSoon();
                          }
                        }}
                        aria-pressed={on}
                        aria-label={`按游戏筛选：${g.name}，${g.streamers.length} 人在播`}
                        className={`flex min-h-[64px] w-full min-w-0 flex-col justify-center rounded-2xl border px-3 py-2 text-left transition-transform active:scale-95 ${
                          on ? "chip-on" : "holo-flat"
                        }`}
                      >
                        <span className="flex w-full min-w-0 items-baseline gap-1.5">
                          <span
                            className={`shrink-0 font-[family-name:var(--font-display)] text-sm font-bold ${on ? "text-white" : "text-[var(--gold)]"}`}
                          >
                            {i + 1}
                          </span>
                          <span className="min-w-0 flex-1 truncate text-sm font-bold leading-snug">
                            {g.name}
                          </span>
                        </span>
                        <span
                          className={`mt-0.5 flex w-full min-w-0 items-baseline gap-1 text-[11px] ${on ? "text-white/85" : "text-[var(--dim)]"}`}
                        >
                          <span className="shrink-0 font-semibold">
                            {g.streamers.length} 人在播
                            {g.viewers != null && g.viewers > 0
                              ? ` · ${compactNum.format(g.viewers)}`
                              : ""}
                          </span>
                          {g.streamers[0] && (
                            <span className="min-w-0 flex-1 truncate">{g.streamers[0]}</span>
                          )}
                        </span>
                      </button>
                    );
                  })}
                  {gameFilter && (
                    <button
                      type="button"
                      onClick={() => applyFilter(() => setGameFilter(null))}
                      aria-label="清除游戏筛选"
                      className="flex min-h-[64px] w-full min-w-0 items-center justify-center rounded-2xl border border-white/20 bg-white/5 px-3 py-2 text-sm font-semibold"
                    >
                      全部游戏
                    </button>
                  )}
                </div>
              )}
            </section>

            {/* roster by region, grouped by agency （个人势 is its own group).
                The wrapper is the landing target for platform choices:
                its top is the top of the roster list, wherever the
                first visible region section happens to start. */}
            <div ref={rosterRef}>
            {REGIONS.map((r) => {
              const list = visibleByRegion.get(r.key) ?? [];
              if (list.length === 0) return null;
              const sorted = [...list].sort((a, b) => {
                const al = a.channels.some((c) => c.state === "live") ? 0 : 1;
                const bl = b.channels.some((c) => c.state === "live") ? 0 : 1;
                return al - bl;
              });
              // Group the region's roster by agency, keeping the live-first
              // order inside each group. Groups with someone live come first,
              // then larger groups first.
              const groups = new Map<string, Vtuber[]>();
              for (const v of sorted) {
                const g = agencyGroup(v);
                const arr = groups.get(g);
                if (arr) arr.push(v);
                else groups.set(g, [v]);
              }
              const orderedGroups = [...groups.entries()]
                .map(([name, members]) => ({
                  name,
                  members,
                  liveCount: members.filter((v) =>
                    v.channels.some((c) => c.state === "live"),
                  ).length,
                }))
                .sort(
                  (a, b) =>
                    b.liveCount - a.liveCount ||
                    b.members.length - a.members.length ||
                    a.name.localeCompare(b.name),
                );
              let cardIndex = 0;
              return (
                <section key={r.key} aria-label={r.label}>
                  <SectionTitle sub={r.sub}>{r.label}</SectionTitle>
                  {orderedGroups.map((g, gi) => (
                    <div key={g.name}>
                      <AgencyHeader
                        name={g.name}
                        count={g.members.length}
                        liveCount={g.liveCount}
                        first={gi === 0}
                      />
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                        {g.members.map((v) => (
                          <PersonCard
                            key={v.slug}
                            v={v}
                            index={cardIndex++}
                            platformFilter={platformFilter}
                            onHide={hidePerson}
                            asmrView={asmrOnly}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </section>
              );
            })}
            </div>

            {!anyVisible && (
              <p className="holo-flat mt-10 rounded-[20px] px-5 py-6 text-center text-sm leading-relaxed text-[var(--text)]/85">
                当前筛选下没有人。换个关键词，或者清掉平台 / 社团 / 游戏 / ASMR 筛选再看。
              </p>
            )}

            {/* hidden by the user, restorable. Always rendered (even
                at 0, with its empty state) so the filter panel's
                「已隐藏」 shortcut always has a landing target at the
                very bottom of the page. */}
            <section aria-label="已隐藏" ref={hiddenRef}>
              <SectionTitle sub="点恢复就回到上面的名单里">已隐藏 · {hiddenList.length} 人</SectionTitle>
              {hiddenList.length === 0 ? (
                <p className="holo-flat rounded-[20px] px-5 py-6 text-center text-sm leading-relaxed text-[var(--text)]/85">
                  还没有隐藏任何人。在名册卡片上点「隐藏」，人就会收进这里，随时能恢复。
                </p>
              ) : (
                <div className="flex flex-col gap-2">
                  {hiddenList.map((v) => (
                    <div
                      key={v.slug}
                      className="holo-flat flex items-center gap-3 rounded-2xl px-3 py-2"
                    >
                      <Avatar slug={v.slug} name={v.name} size={32} />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold">{v.name}</p>
                        <p className="truncate text-[11px] text-[var(--dim)]">
                          {[v.nameAlt, agencyGroup(v)].filter(Boolean).join(" · ")}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => restorePerson(v)}
                        aria-label={`恢复显示 ${v.name}`}
                        className="shrink-0 rounded-full border border-white/20 bg-white/5 px-3.5 py-1.5 text-xs font-semibold transition-transform active:scale-95"
                      >
                        恢复
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <footer className="mt-12 border-t border-white/8 pt-5 text-xs leading-relaxed text-[var(--dim)]">
              <p>
                在播卡上是平台自己的画面：Twitch 是 720p 实时预览帧、Bilibili
                是直播间系统截图，卡片在眼前时约每 45
                秒换一帧，图上标了更新时间。YouTube 不提供可用的高清直播帧（唯一的直播帧源只有
                159×90，放大满卡会糊），所以 YouTube 的卡改用当前直播封面（有
                1280×720 就用 1280×720），如实标「直播封面」。这不是视频播放——点截图或按钮去
                App / 网页看真正的直播。
              </p>
              <p className="mt-2">
                直播状态来自 Bilibili、YouTube、Twitch 的公开页面，每 15
                分钟刷新一次，不是秒级实时；Twitch 数据源较弱，偶尔会显示「状态未知」。ON AIR
                全平台按真实同接混排：B站的真实在线人数取自直播间高能榜接口的
                onlineNum（B站 API 文档标注为「在线观众数量」），ON AIR 只标「同接」；名册卡上另外还标「人气值」——人气值是弹幕/礼物加权的热度分，只作参考，从不当同接用。个别
                B站房间取不到在线人数时，ON AIR 的同接位显示「—」，并按实测校准的人气值 ÷ 106
                估算她的排序位置：这个估算只决定名次，绝不显示成人数。
              </p>
              <p className="mt-2">
                ASMR
                有两层意思，别混：名册卡名字旁的小标签「ASMR」是这个人常做
                ASMR（人）；亮色的「ASMR
                直播中」徽标只看这一场——按平台分类和本场标题判定，她这场真在做
                ASMR 才有。ASMR 主播开游戏/杂谈场时不会有这个徽标，卡上照常写她这场在播的游戏。B站对
                ASMR 直播有限制，那边的主播常用「3D麦」「呼呼」「舒缓」这类委婉说法当标题，B站的场次判定会结合她是不是
                ASMR 常驻、所在分区一起认这些说法；能识别出在玩游戏时仍按游戏算，不会误标。
              </p>
              <p className="mt-2">
                名单按你的口味人工精选，只收女性人格 VTuber；想加人或删人，跟我说一声就行。
              </p>
            </footer>
          </>
        )}
      </main>

      {/* back to top: fixed bottom-right, above the bottom safe area,
          glass styled like the rest of the page. z-30 sits above card
          content (cards are z-auto) and never collides with the
          sticky toolbar (z-20, top of screen) or the ON AIR ticker
          (in the header, in flow). Hidden state keeps it mounted but
          fully transparent, non-interactive and out of the tab order,
          so appearing/disappearing moves nothing on the page. */}
      <button
        type="button"
        onClick={backToTop}
        aria-label="回到顶部"
        aria-hidden={!showBackTop}
        tabIndex={showBackTop ? 0 : -1}
        style={{ bottom: "calc(env(safe-area-inset-bottom, 0px) + 16px)" }}
        className={`holo fixed right-4 z-30 flex h-12 w-12 items-center justify-center rounded-full text-[var(--text)] transition-all duration-300 ${
          showBackTop
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-3 opacity-0"
        }`}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M12 19V5m0 0-6.5 6.5M12 5l6.5 6.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
}
