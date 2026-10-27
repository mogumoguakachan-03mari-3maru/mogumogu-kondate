/*
  もぐもぐ献立 Ver.6
  12〜18か月向け詳細レシピ
  ID 191〜300（110品）

  既存の300品を維持
  元レシピの調理説明を活用
  最大5工程
*/

(function () {
  "use strict";

  const recipes = window.MOGU_RECIPES;

  if (!Array.isArray(recipes)) {
    console.error("recipes.js が読み込まれていません");
    return;
  }

  function step(title, description, minutes) {
    return {
      title: title,
      description: description,
      minutes: minutes
    };
  }

  // 食材別の下処理
  const prep = {
    "鶏ひき肉":
      "使用する直前まで冷蔵し、中心まで十分に加熱する。",
    "鶏むね肉":
      "皮や余分な脂を除き、小さく切る。",
    "鶏ささみ":
      "筋を取り除き、食べやすい大きさにする。",
    "豚赤身肉":
      "脂や筋を除き、細かく切る。",
    "牛赤身肉":
      "脂や筋を除き、細かく切る。",
    "鮭":
      "加熱用を使い、加熱後に骨と皮を丁寧に取り除く。",
    "白身魚":
      "加熱後に骨と皮が残っていないか確認する。",
    "まぐろ":
      "中心まで十分に加熱する。",
    "かつお":
      "中心まで十分に加熱する。",
    "ツナ水煮":
      "食塩無添加のものを選び、細かくほぐす。",
    "豆腐":
      "必要量を取り分け、中心まで十分に加熱する。",
    "全卵":
      "半熟を避け、中心まで完全に加熱する。",
    "じゃがいも":
      "皮と芽を取り除き、やわらかく加熱する。",
    "さつまいも":
      "皮をむき、やわらかく加熱する。",
    "かぼちゃ":
      "種とワタを除き、硬い皮は取り除く。",
    "にんじん":
      "皮をむき、食べやすい大きさに切る。",
    "玉ねぎ":
      "皮をむき、薄く切る。",
    "トマト":
      "必要に応じて皮と種を除く。",
    "ブロッコリー":
      "よく洗い、十分にやわらかく加熱する。",
    "小松菜":
      "よく洗い、硬い部分を除いて細かくする。",
    "ほうれん草":
      "よく洗い、ゆでて水に取り、細かくする。",
    "キャベツ":
      "硬い芯を除き、食べやすい大きさに切る。",
    "白菜":
      "硬い部分を避け、細かく切る。",
    "大根":
      "皮をむき、食べやすい大きさに切る。",
    "かぶ":
      "皮をむき、食べやすい大きさに切る。",
    "うどん":
      "十分にやわらかくゆで、食べやすい長さに切る。",
    "そうめん":
      "ゆでた後に洗って塩分を落とし、短く切る。",
    "パスタ":
      "十分にやわらかくゆで、食べやすい長さに切る。",
    "マカロニ":
      "十分にやわらかくゆで、小さく切る。",
    "軟飯":
      "食べ慣れたやわらかさの軟飯を用意する。",
    "食パン":
      "硬い耳を除き、食べやすい大きさにする。",
    "バナナ":
      "皮をむき、食べやすくつぶす。",
    "りんご":
      "皮と芯を取り除く。",
    "桃":
      "皮と種を取り除く。",
    "梨":
      "皮と芯を取り除く。",
    "いちご":
      "へたを除き、よく洗う。",
    "プレーンヨーグルト":
      "砂糖不使用のものを使用する。"
  };

  function ingredientNames(recipe) {
    return recipe.ingredients.map(item => item[0]);
  }

  function has(recipe, name) {
    return ingredientNames(recipe).includes(name);
  }

  function nameIncludes(recipe, words) {
    return words.some(word => recipe.name.includes(word));
  }

  function preparationText(recipe) {
    const lines = ingredientNames(recipe)
      .filter(name => prep[name])
      .map(name => "【" + name + "】" + prep[name]);

    return lines.length
      ? lines.join("\n")
      : "材料を計量し、必要な下処理をする。";
  }

  // 料理の種類を判定
  function dishType(recipe) {
    if (nameIncludes(recipe, [
      "ハンバーグ",
      "つくね",
      "ナゲット",
      "ミートローフ",
      "ミニバーグ",
      "チキンボール"
    ])) {
      return "meat";
    }

    if (nameIncludes(recipe, [
      "おやき",
      "パンケーキ",
      "ふんわり焼き",
      "ポテト焼き",
      "スティック焼き"
    ])) {
      return "griddle";
    }

    if (nameIncludes(recipe, [
      "グラタン",
      "ドリア",
      "重ね焼き"
    ])) {
      return "baked";
    }

    if (nameIncludes(recipe, [
      "炒め",
      "ソテー"
    ])) {
      return "stir";
    }

    if (nameIncludes(recipe, [
      "うどん",
      "そうめん",
      "パスタ",
      "マカロニ"
    ])) {
      return "noodle";
    }

    if (nameIncludes(recipe, [
      "スープ",
      "ポタージュ",
      "みそ汁",
      "すまし汁"
    ])) {
      return "soup";
    }

    if (nameIncludes(recipe, [
      "おにぎり",
      "混ぜごはん",
      "リゾット",
      "チャーハン",
      "炊き込み"
    ])) {
      return "rice";
    }

    if (nameIncludes(recipe, [
      "煮物",
      "煮込み",
      "シチュー",
      "肉じゃが"
    ])) {
      return "stew";
    }

    if (nameIncludes(recipe, [
      "サラダ",
      "和え",
      "マッシュ",
      "白和え"
    ])) {
      return "mix";
    }

    if (recipe.type === "果物") {
      return "dessert";
    }

    return "other";
  }

  // 元の調理説明を文単位で分割
  function splitInstructions(recipe) {
    const original = String(recipe.steps || "");

    return original
      .split(/[。！？]/)
      .map(text => text.trim())
      .filter(Boolean);
  }

  // 調理工程のタイトルを決定
  function instructionTitle(text, index) {
    if (/焼く|焼き|焼いて/.test(text)) {
      return "焼いて仕上げる";
    }

    if (/蒸す|蒸し|蒸して/.test(text)) {
      return "蒸して加熱する";
    }

    if (/ゆで|茹で/.test(text)) {
      return "やわらかくゆでる";
    }

    if (/煮る|煮て|煮込/.test(text)) {
      return "具材を煮る";
    }

    if (/炒め/.test(text)) {
      return "具材を炒める";
    }

    if (/混ぜ|合わせ|和え/.test(text)) {
      return "材料を混ぜ合わせる";
    }

    if (/成形|形に|丸め/.test(text)) {
      return "食べやすく成形する";
    }

    if (/刻む|切る|除く|つぶす/.test(text)) {
      return "食材を下処理する";
    }

    return "調理する " + (index + 1);
  }

  // 料理別の補足
  function cookingNote(recipe, type) {
    if (type === "meat") {
      return "肉を使用するため、中心まで完全に火を通す。厚い塊にならないようにする。";
    }

    if (type === "griddle") {
      return "表面だけでなく中心まで加熱する。食べやすい大きさとやわらかさにする。";
    }

    if (type === "baked") {
      return "具材を十分に加熱し、熱い部分が残らないように冷ます。";
    }

    if (type === "stir") {
      return "硬い部分が残らないようにする。肉や魚を含む場合は中心まで加熱する。";
    }

    if (type === "noodle") {
      return "麺は短く切り、十分にやわらかくする。";
    }

    if (type === "soup") {
      return "具材を食べやすい大きさにし、熱すぎない状態にする。";
    }

    if (type === "rice") {
      return "ごはんは食べ慣れたやわらかさにする。大きな塊にならないようにする。";
    }

    if (type === "stew") {
      return "具材が歯ぐきでつぶせる程度にやわらかくなるまで煮る。";
    }

    if (type === "mix") {
      return "食材の硬さや大きさをそろえ、食べやすくする。";
    }

    if (type === "dessert") {
      return "果物の種や硬い部分を取り除き、食べやすい状態にする。";
    }

    return "食材の硬さと大きさを確認する。";
  }

  function buildSteps(recipe) {
    const type = dishType(recipe);
    const original = splitInstructions(recipe);

    const result = [
      step(
        "材料を準備する",
        preparationText(recipe),
        4
      )
    ];

    // 元の説明を最大3工程に分ける
    const instructions = original.slice(0, 3);

    instructions.forEach(function (text, index) {
      result.push(
        step(
          instructionTitle(text, index),
          text + "。",
          5
        )
      );
    });

    // 元の説明が長い場合は、残りを省略せず
    // 最後の調理工程にまとめる
    if (original.length > 3) {
      const rest = original.slice(3).join("。") + "。";
      const last = result[result.length - 1];

      last.description += "\n" + rest;
    }

    // 元の説明が空の場合
    if (original.length === 0) {
      result.push(
        step(
          "調理する",
          "元のレシピに調理説明がありません。材料と調理方法の確認が必要です。",
          5
        )
      );
    }

    result.push(
      step(
        "仕上がりを確認する",
        cookingNote(recipe, type) +
        "\n骨・皮・硬い塊が残っていないか確認し、食べやすい温度まで冷ます。",
        1
      )
    );

    return result.slice(0, 5);
  }

  function difficulty(recipe, steps) {
    const type = dishType(recipe);
    const count = recipe.ingredients.length;

    let score = 0;

    if (count >= 3) score++;
    if (count >= 4) score++;

    if (["meat", "griddle"].includes(type)) {
      score += 2;
    }

    if (["baked", "stir", "noodle"].includes(type)) {
      score++;
    }

    if (steps.length === 5) score++;

    if (Number(recipe.time) >= 25) score++;

    if (score <= 1) return "簡単";
    if (score <= 3) return "普通";
    if (score <= 5) return "ちょい手間";

    return "時間がかかる";
  }

  function liquidData(recipe) {
    const type = dishType(recipe);

    if (type === "dessert") {
      return [];
    }

    let note = "調理に必要な水量は未確認。";

    if (type === "noodle") {
      note =
        "麺をゆでる水と仕上げに使う水分は別。使用量は未確認。";
    }

    if (type === "soup") {
      note =
        "スープ用の水分量は未確認。食材や鍋に合わせて調整する。";
    }

    if (type === "rice") {
      note =
        "完成済みのごはんを使用する場合の加水量は未確認。";
    }

    if (type === "meat" || type === "griddle") {
      note =
        "下処理で水を使用する場合がある。焼く工程で水を加えるとは限らない。";
    }

    return [{
      name: "水・湯",
      amount: null,
      unit: "ml",
      status: "未確認",
      note: note
    }];
  }

  let updated = 0;

  recipes.forEach(function (recipe) {
    if (recipe.id < 191 || recipe.id > 300) {
      return;
    }

    const steps = buildSteps(recipe);

    const totalTime = Number(recipe.time) || 20;
    const prepTime = 5;

    Object.assign(recipe, {
      difficulty: difficulty(recipe, steps),

      prepTime: prepTime,
      cookTime: Math.max(totalTime - prepTime, 0),
      totalTime: totalTime,

      stepsDetailed: steps,

      cookingLiquids: liquidData(recipe),

      detailStatus:
        "元のレシピを基に工程を分割した暫定版。水量・調理時間は実測未検証。"
    });

    updated++;
  });

  console.log(
    "Ver.6：12〜18か月向け " +
    updated +
    " 品の詳細工程を追加しました"
  );

})();
