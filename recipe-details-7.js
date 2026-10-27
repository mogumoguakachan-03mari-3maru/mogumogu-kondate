/*
  もぐもぐ献立 Ver.6
  7〜8か月向け詳細レシピ
  ID 41〜100

  既存の300品を維持
  最大5工程
  水量は未確認として管理
*/

(function () {
  "use strict";

  const recipes = window.MOGU_RECIPES;

  if (!Array.isArray(recipes)) {
    console.error("recipes.js が読み込まれていません");
    return;
  }

  function makeStep(title, description, minutes) {
    return {
      title: title,
      description: description,
      minutes: minutes
    };
  }

  // 食材ごとの下処理
  const preparations = {
    "うどん":
      "食塩を含む場合は十分にゆでて湯を切り、月齢に合わせて短く切る。",
    "そうめん":
      "十分にやわらかくゆで、流水で洗って塩分を落とし、短く切る。",
    "米がゆ":
      "月齢に合ったやわらかさのおかゆを用意する。",
    "鶏ささみ":
      "筋を取り除く。十分に加熱してから細かくほぐす。",
    "鮭":
      "加熱用の鮭を使う。十分に加熱し、皮と骨を丁寧に取り除く。",
    "白身魚":
      "十分に加熱し、皮と骨が残っていないことを確認する。",
    "豆腐":
      "必要量を取り分け、中心まで十分に加熱する。",
    "納豆":
      "必要に応じて細かく刻む。付属のたれやからしは使わない。",
    "にんじん":
      "皮をむき、薄く切ってやわらかく加熱する。",
    "かぼちゃ":
      "種とワタを除き、加熱してやわらかくしてから皮を取り除く。",
    "さつまいも":
      "皮をむいて小さく切り、やわらかく加熱する。",
    "じゃがいも":
      "皮と芽を取り除き、小さく切ってやわらかく加熱する。",
    "小松菜":
      "よく洗い、やわらかい葉先を使って十分にゆでる。",
    "ほうれん草":
      "よく洗い、葉先をゆでて水に取り、細かく刻む。",
    "ブロッコリー":
      "よく洗い、穂先を十分にやわらかくゆでる。",
    "白菜":
      "やわらかい葉を選び、細かく切って十分に煮る。",
    "キャベツ":
      "硬い芯を除き、葉を細かく切って十分に煮る。",
    "大根":
      "皮をむいて薄く切り、十分にやわらかく煮る。",
    "かぶ":
      "皮をむいて小さく切り、十分にやわらかく煮る。",
    "玉ねぎ":
      "皮をむいて薄く切り、十分にやわらかく煮る。",
    "トマト":
      "皮と種を除き、果肉を加熱してやわらかくする。",
    "りんご":
      "皮と芯を除き、小さく切ってやわらかく加熱する。",
    "梨":
      "皮と芯を除き、小さく切ってやわらかく加熱する。",
    "桃":
      "皮と種を除き、食べやすく細かくする。",
    "バナナ":
      "皮をむき、筋を除いてなめらかにつぶす。",
    "いちご":
      "へたを除き、よく洗って細かくつぶす。",
    "プレーンヨーグルト":
      "砂糖を加えていないプレーンヨーグルトを使用する。",
    "きな粉":
      "粉のまま吸い込まないよう、必ず水分のある食材に混ぜる。"
  };

  function prepareText(recipe) {
    return recipe.ingredients
      .map(item => item[0])
      .filter(name => preparations[name])
      .map(name => "【" + name + "】" + preparations[name])
      .join("\n");
  }

  function has(recipe, food) {
    return recipe.ingredients.some(item => item[0] === food);
  }

  function isNoodle(recipe) {
    return has(recipe, "うどん") ||
           has(recipe, "そうめん");
  }

  function isPorridge(recipe) {
    return has(recipe, "米がゆ");
  }

  function isYogurt(recipe) {
    return has(recipe, "プレーンヨーグルト");
  }

  function isSoup(recipe) {
    return recipe.name.includes("スープ");
  }

  function isStew(recipe) {
    return recipe.name.includes("煮物");
  }

  function hasAnimalProtein(recipe) {
    return [
      "鶏ささみ",
      "鮭",
      "白身魚"
    ].some(food => has(recipe, food));
  }

  function isFruitDish(recipe) {
    return recipe.type === "果物";
  }

  // 料理の種類に応じて仕上げ方を変える
  function finishText(recipe) {
    if (isNoodle(recipe)) {
      return "麺を短くし、具材も細かくする。煮汁を含ませ、舌でつぶせるやわらかさに仕上げる。";
    }

    if (isPorridge(recipe)) {
      return "おかゆと具材をよく混ぜる。具材は細かくし、舌でつぶせるやわらかさに調整する。";
    }

    if (isSoup(recipe)) {
      return "具材を細かくし、煮汁と合わせる。水分が多すぎる場合は食べやすい状態に調整する。";
    }

    if (isStew(recipe)) {
      return "具材を細かくほぐし、煮汁を含ませてしっとり仕上げる。";
    }

    if (isYogurt(recipe)) {
      return "果物を細かくつぶし、ヨーグルトとよく混ぜる。";
    }

    if (isFruitDish(recipe)) {
      return "果物の硬い部分や大きな塊を残さず、食べやすくする。";
    }

    return "食材を細かくし、舌でつぶせるやわらかさにする。必要に応じて煮汁を含ませる。";
  }

  // 料理の種類によって工程を設定
  function makeSteps(recipe) {
    const steps = [];

    const preparation = prepareText(recipe);

    steps.push(
      makeStep(
        "材料を準備する",
        preparation ||
          "材料を計量し、必要に応じて洗って下処理する。",
        4
      )
    );

    if (isYogurt(recipe)) {
      steps.push(
        makeStep(
          "果物を調理する",
          recipe.steps,
          4
        )
      );

      steps.push(
        makeStep(
          "ヨーグルトと合わせる",
          "果物が食べやすい状態になったら、プレーンヨーグルトと混ぜる。",
          1
        )
      );
    } else if (isNoodle(recipe)) {
      steps.push(
        makeStep(
          "麺をやわらかくする",
          "麺を十分にやわらかくゆで、短く切る。塩分を含む麺はゆで汁を捨て、必要に応じて洗う。",
          7
        )
      );

      steps.push(
        makeStep(
          "具材を加熱する",
          recipe.steps,
          8
        )
      );
    } else if (isPorridge(recipe)) {
      steps.push(
        makeStep(
          "具材を加熱する",
          recipe.steps,
          10
        )
      );

      steps.push(
        makeStep(
          "おかゆと合わせる",
          "完成済みのおかゆと調理した具材を混ぜ、全体を十分に温める。",
          3
        )
      );
    } else {
      steps.push(
        makeStep(
          hasAnimalProtein(recipe)
            ? "食材を十分に加熱する"
            : "食材をやわらかく調理する",
          recipe.steps,
          Math.max(5, Number(recipe.time || 15) - 7)
        )
      );
    }

    steps.push(
      makeStep(
        "食べやすく仕上げる",
        finishText(recipe),
        2
      )
    );

    steps.push(
      makeStep(
        "温度と状態を確認する",
        "人肌程度まで冷まし、熱すぎないことを確認する。硬い塊、骨、皮などが残っていないか確認する。",
        1
      )
    );

    return steps.slice(0, 5);
  }

  // 難易度は時間だけでなく下処理と工程から判断
  function getDifficulty(recipe) {
    let score = 0;

    const foods = recipe.ingredients.map(item => item[0]);

    if (foods.length >= 3) score += 1;

    if (foods.length >= 4) score += 1;

    if (isNoodle(recipe)) score += 1;

    if (hasAnimalProtein(recipe)) score += 1;

    if (isSoup(recipe) || isStew(recipe)) score += 1;

    if (recipe.name.includes("あんかけ")) score += 1;

    if (Number(recipe.time) > 20) score += 1;

    if (score <= 0) return "簡単";
    if (score <= 2) return "普通";
    if (score <= 4) return "ちょい手間";

    return "時間がかかる";
  }

  // 水分の種類を料理に合わせて設定
  function liquidData(recipe) {
    if (isYogurt(recipe)) {
      return [];
    }

    if (isFruitDish(recipe)) {
      return [{
        name: "水",
        amount: null,
        unit: "ml",
        status: "未確認",
        note: "加熱が必要な場合のみ使用。量は食材や調理器具によって異なる。"
      }];
    }

    if (isPorridge(recipe)) {
      return [{
        name: "水・湯",
        amount: null,
        unit: "ml",
        status: "未確認",
        note: "完成済みのおかゆを使用。必要に応じて水分を調整する。"
      }];
    }

    if (isNoodle(recipe)) {
      return [{
        name: "水・湯",
        amount: null,
        unit: "ml",
        status: "未確認",
        note: "麺をゆでる水と、仕上げの煮汁は別に必要。使用量は未確認。"
      }];
    }

    return [{
      name: "水・湯",
      amount: null,
      unit: "ml",
      status: "未確認",
      note: "食材をやわらかく加熱するために使用。鍋や食材の状態に応じて調整する。"
    }];
  }

  let updated = 0;

  for (const recipe of recipes) {
    if (recipe.id < 41 || recipe.id > 100) {
      continue;
    }

    const steps = makeSteps(recipe);

    const originalTime = Number(recipe.time) || 15;

    const prepTime = isYogurt(recipe) ? 3 : 5;

    // 元の所要時間を暫定的な合計時間として利用
    const totalTime = Math.max(
      originalTime,
      prepTime + 2
    );

    const cookTime = totalTime - prepTime;

    Object.assign(recipe, {
      difficulty: getDifficulty(recipe),

      prepTime: prepTime,
      cookTime: cookTime,
      totalTime: totalTime,

      stepsDetailed: steps,

      cookingLiquids: liquidData(recipe),

      detailStatus:
        "詳細工程は既存レシピを基に整理した暫定版。水量・所要時間は実測未検証。"
    });

    updated++;
  }

  console.log(
    "Ver.6：7〜8か月向け詳細レシピ " +
    updated +
    " 品を追加しました"
  );

})();
