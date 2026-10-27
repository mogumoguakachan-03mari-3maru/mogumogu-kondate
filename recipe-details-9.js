/*
  もぐもぐ献立 Ver.6
  9〜11か月向け詳細レシピ
  ID 101〜190（90品）

  ・既存のレシピを維持
  ・最大5工程
  ・料理の種類で工程を変更
  ・難易度は工程と下処理から判定
  ・水量は未確認として管理

  注意：
  既存の調理説明を工程別に整理した暫定版です。
  分量・調理時間の実測検証は未実施です。
*/

(function () {
  "use strict";

  const R = window.MOGU_RECIPES;

  if (!Array.isArray(R)) {
    console.error("recipes.js が読み込まれていません");
    return;
  }

  function S(title, description, minutes) {
    return { title, description, minutes };
  }

  const prep = {
    "軟飯": "月齢に合うやわらかさの軟飯を用意する。",
    "うどん": "やわらかくゆでて短く切る。塩分を含む場合はゆで汁を捨てる。",
    "そうめん": "やわらかくゆで、洗って塩分を落とし、短く切る。",
    "パスタ": "表示時間より長めにゆで、十分にやわらかくして短く切る。",
    "マカロニ": "十分にやわらかくゆで、小さく切る。",
    "オートミール": "水分を加え、十分にやわらかくなるまで加熱する。",
    "鶏ひき肉": "ほぐしながら加熱し、中心まで完全に火を通す。",
    "鶏ささみ": "筋を除き、十分に加熱して細かくほぐす。",
    "鶏むね肉": "皮や脂を除き、小さく切って十分に加熱する。",
    "豚赤身肉": "脂や筋を除き、小さく切って十分に加熱する。",
    "鮭": "加熱用を使い、十分に火を通して皮と骨を取り除く。",
    "白身魚": "十分に加熱し、皮と骨が残っていないか確認する。",
    "まぐろ": "中心まで十分に加熱し、細かくほぐす。",
    "かつお": "中心まで十分に加熱し、細かくほぐす。",
    "ツナ水煮": "食塩無添加のものを選び、細かくほぐす。",
    "全卵": "使用する場合は半熟を避け、中心まで完全に加熱する。",
    "豆腐": "中心まで十分に加熱する。",
    "納豆": "必要に応じて刻む。たれやからしは使わない。",
    "きな粉": "粉のまま与えず、水分のある食材とよく混ぜる。",
    "にんじん": "皮をむき、薄く切ってやわらかく加熱する。",
    "じゃがいも": "皮と芽を取り除き、やわらかく加熱する。",
    "さつまいも": "皮をむいて小さく切り、やわらかく加熱する。",
    "かぼちゃ": "種とワタを除き、加熱後に硬い皮を取り除く。",
    "玉ねぎ": "皮をむいて薄く切り、十分にやわらかく加熱する。",
    "トマト": "皮と種を除き、果肉を加熱する。",
    "ブロッコリー": "やわらかい穂先を十分に加熱する。",
    "ほうれん草": "葉先をゆでて水に取り、細かく刻む。",
    "小松菜": "葉先を十分にゆで、細かく刻む。",
    "白菜": "やわらかい葉を選び、細かく切って煮る。",
    "キャベツ": "硬い芯を除き、葉をやわらかく煮る。",
    "大根": "皮をむいて小さく切り、やわらかく煮る。",
    "かぶ": "皮をむいて小さく切り、やわらかく煮る。",
    "オクラ": "十分に加熱し、硬い部分を除いて細かく刻む。",
    "とうもろこし": "やわらかく加熱し、薄皮を除いてつぶす。",
    "りんご": "皮と芯を除き、やわらかく加熱する。",
    "洋梨": "皮と芯を除き、やわらかく加熱する。",
    "桃": "皮と種を除き、必要に応じて加熱する。",
    "バナナ": "皮をむき、なめらかにつぶす。",
    "いちご": "へたを除いて洗い、細かくする。",
    "プレーンヨーグルト": "砂糖不使用のものを使う。"
  };

  function names(r) {
    return r.ingredients.map(x => x[0]);
  }

  function contains(r, word) {
    return r.name.includes(word);
  }

  function has(r, word) {
    return names(r).includes(word);
  }

  function isNoodle(r) {
    return ["うどん", "そうめん", "パスタ", "マカロニ"]
      .some(x => has(r, x));
  }

  function isRice(r) {
    return has(r, "軟飯");
  }

  function isHandFood(r) {
    return [
      "おやき", "スティック", "ポテトボール",
      "つくね", "ハンバーグ", "ミートボール",
      "ふんわり焼き", "パンケーキ"
    ].some(x => contains(r, x));
  }

  function isEgg(r) {
    return has(r, "全卵");
  }

  function isSoup(r) {
    return [
      "スープ", "ポタージュ", "すまし汁",
      "ミネストローネ"
    ].some(x => contains(r, x));
  }

  function isDessert(r) {
    return r.type === "果物";
  }

  function isSoftMix(r) {
    return [
      "和え", "マッシュ", "サラダ",
      "ディップ", "茶巾", "ムース"
    ].some(x => contains(r, x));
  }

  function isSteam(r) {
    return [
      "蒸し", "茶碗蒸し", "ココット"
    ].some(x => contains(r, x));
  }

  function isOvenStyle(r) {
    return [
      "グラタン", "ドリア", "重ね焼き",
      "クリーミー焼き"
    ].some(x => contains(r, x));
  }

  function isFishOrMeat(r) {
    return names(r).some(x =>
      /鶏|豚|牛|鮭|白身魚|まぐろ|かつお|ツナ/.test(x)
    );
  }

  function prepText(r) {
    const lines = names(r)
      .filter(x => prep[x])
      .map(x => "【" + x + "】" + prep[x]);

    return lines.length
      ? lines.join("\n")
      : "材料を計量し、洗浄や皮むきなど必要な下処理をする。";
  }

  function cookingType(r) {
    if (isHandFood(r)) return "hand";
    if (isEgg(r)) return "egg";
    if (isSteam(r)) return "steam";
    if (isOvenStyle(r)) return "oven";
    if (isNoodle(r)) return "noodle";
    if (isRice(r)) return "rice";
    if (isSoup(r)) return "soup";
    if (isDessert(r)) return "dessert";
    if (isSoftMix(r)) return "mix";
    return "stew";
  }

  function buildSteps(r) {
    const type = cookingType(r);
    const result = [];

    result.push(S(
      "材料を準備する",
      prepText(r),
      5
    ));

    if (type === "hand") {
      result.push(S(
        "材料をやわらかくする",
        "野菜やいも類を十分に加熱し、つぶすか細かく刻む。肉や魚を使う場合は、元のレシピの下処理も確認する。",
        7
      ));

      result.push(S(
        "混ぜて成形する",
        "元の調理説明を確認しながら材料を混ぜる。まとまりにくい場合は無理に成形しない。丸い塊を避け、小さく薄い形にする。",
        3
      ));

      result.push(S(
        "十分に加熱する",
        r.steps +
        "\n肉や卵を含む場合は中心まで完全に火を通す。",
        7
      ));

    } else if (type === "egg") {
      result.push(S(
        "具材を下調理する",
        "野菜などの具材を十分にやわらかく加熱し、細かくする。",
        6
      ));

      result.push(S(
        "卵と合わせる",
        "元のレシピに従って卵と具材を合わせる。卵を使用するのは、食べ慣れていることを確認してからにする。",
        2
      ));

      result.push(S(
        "中心まで加熱する",
        r.steps +
        "\n半熟の部分を残さず、完全に火を通す。",
        7
      ));

    } else if (type === "steam") {
      result.push(S(
        "具材を整える",
        "具材を月齢に合う大きさにし、元のレシピに従って混ぜる。",
        5
      ));

      result.push(S(
        "蒸して加熱する",
        r.steps +
        "\n中心まで十分に加熱する。卵を含む場合は完全に固める。",
        10
      ));

    } else if (type === "oven") {
      result.push(S(
        "具材を加熱する",
        "肉・魚・野菜などを、それぞれ十分に加熱する。",
        8
      ));

      result.push(S(
        "重ねて仕上げる",
        r.steps +
        "\n元のレシピが「風」としている料理は、焼き色をつける必要はない。",
        5
      ));

    } else if (type === "noodle") {
      result.push(S(
        "麺をやわらかくする",
        "麺を十分にやわらかくゆでて短く切る。塩分を含む麺はゆで汁を捨て、必要に応じて洗う。",
        7
      ));

      result.push(S(
        "具材を調理する",
        r.steps,
        8
      ));

    } else if (type === "rice") {
      result.push(S(
        "具材を加熱する",
        r.steps,
        10
      ));

      result.push(S(
        "軟飯と合わせる",
        "月齢に合う軟飯を加え、具材とよく混ぜる。全体を十分に温める。",
        3
      ));

    } else if (type === "soup") {
      result.push(S(
        "具材を煮る",
        r.steps,
        10
      ));

      result.push(S(
        "水分とやわらかさを調整する",
        "具材を細かくし、煮汁と合わせる。水分量は食材と鍋の大きさに応じて調整する。",
        3
      ));

    } else if (type === "dessert") {
      result.push(S(
        "材料を食べやすくする",
        r.steps,
        7
      ));

      result.push(S(
        "混ぜ合わせる",
        "元のレシピに従って材料を合わせ、硬い塊が残らない状態にする。",
        2
      ));

    } else if (type === "mix") {
      result.push(S(
        "食材を加熱する",
        r.steps,
        8
      ));

      result.push(S(
        "和えて仕上げる",
        "食材を細かくし、しっとりと食べやすい状態に混ぜ合わせる。",
        2
      ));

    } else {
      result.push(S(
        "具材を十分に加熱する",
        r.steps,
        10
      ));

      result.push(S(
        "食べやすく仕上げる",
        "具材を細かくほぐし、舌や歯ぐきでつぶしやすいやわらかさにする。",
        3
      ));
    }

    // 最大5工程。最後に安全確認を入れる。
    result.push(S(
      "仕上がりを確認する",
      "中心まで火が通っていることを確認する。骨・皮・硬い塊が残っていないか確認し、食べやすい温度まで冷ます。",
      1
    ));

    return result.slice(0, 5);
  }

  function difficulty(r, steps) {
    let score = 0;
    const foods = names(r);

    if (foods.length >= 3) score++;
    if (foods.length >= 4) score++;

    if (isFishOrMeat(r)) score++;
    if (isNoodle(r)) score++;
    if (isHandFood(r)) score += 2;
    if (isEgg(r)) score++;
    if (isSteam(r)) score++;
    if (isOvenStyle(r)) score++;
    if (steps.length === 5) score++;

    if (Number(r.time) >= 25) score++;

    if (score <= 1) return "簡単";
    if (score <= 3) return "普通";
    if (score <= 5) return "ちょい手間";
    return "時間がかかる";
  }

  function liquids(r) {
    const type = cookingType(r);

    // 調理水が不要な場合は追加しない
    if (
      type === "dessert" &&
      !/加熱|ゆで|煮|蒸し|ふやかす/.test(r.steps)
    ) {
      return [];
    }

    let note;

    if (type === "noodle") {
      note =
        "麺をゆでる水と仕上げの煮汁は別。具体的な使用量は未確認。";
    } else if (type === "rice") {
      note =
        "完成済みの軟飯を使用。具材の加熱や仕上げに必要な水量は未確認。";
    } else if (type === "soup") {
      note =
        "スープ用の水分量は未確認。鍋の大きさと食材の状態に応じて調整する。";
    } else if (type === "hand") {
      note =
        "食材をゆでる・蒸す際の水。成形時に水を加えるとは限らない。";
    } else {
      note =
        "下調理に必要な水量は未確認。調理方法と器具に応じて調整する。";
    }

    return [{
      name: "水・湯",
      amount: null,
      unit: "ml",
      status: "未確認",
      note: note
    }];
  }

  let count = 0;

  R.forEach(function (r) {
    if (r.id < 101 || r.id > 190) return;

    const steps = buildSteps(r);
    const originalTime = Number(r.time) || 20;

    // 元データの時間を暫定的に利用
    const prepTime = 5;
    const totalTime = Math.max(originalTime, prepTime + 5);
    const cookTime = totalTime - prepTime;

    Object.assign(r, {
      difficulty: difficulty(r, steps),
      prepTime: prepTime,
      cookTime: cookTime,
      totalTime: totalTime,
      stepsDetailed: steps,
      cookingLiquids: liquids(r),
      detailStatus:
        "既存レシピを基に工程を整理した暫定版。水量・所要時間は実測未検証。"
    });

    count++;
  });

  console.log(
    "Ver.6：9〜11か月向け " +
    count +
    " 品の詳細データを追加しました"
  );

})();
