/*
  もぐもぐ献立 Ver.6
  詳細レシピ 第1弾：ID 1〜40

  ・既存の300品を削除しない
  ・調理手順は最大5工程
  ・水量が未確認の場合、数値を捏造しない
  ・水やだしは食材チェック用の材料に追加しない
*/

(function () {
  "use strict";

  const recipes = window.MOGU_RECIPES;

  if (!Array.isArray(recipes)) {
    console.error("recipes.js が読み込まれていません");
    return;
  }

  // 工程を作成する
  function step(title, description, minutes) {
    return {
      title: title,
      description: description,
      minutes: minutes
    };
  }

  // 詳細データを既存レシピに追加する
  function update(id, data) {
    const recipe = recipes.find(r => r.id === id);

    if (!recipe) {
      console.warn("レシピが見つかりません:", id);
      return;
    }

    Object.assign(recipe, data);

    // 詳細工程は必ず5工程以内
    if (recipe.stepsDetailed.length > 5) {
      recipe.stepsDetailed =
        recipe.stepsDetailed.slice(0, 5);
    }
  }

  // 共通の仕上げ工程
  const smooth = step(
    "なめらかに仕上げる",
    "やわらかくなった食材をすりつぶすか裏ごしする。粒や硬い繊維が残らないようにし、赤ちゃんが飲み込みやすい状態にする。",
    3
  );

  const cool = step(
    "温度を確認する",
    "人肌程度まで冷まし、熱すぎないことを確認してから与える。",
    1
  );

  // 野菜ペーストの共通登録
  function vegetablePaste(id, options) {
    const {
      food,
      preparation,
      heating,
      minutes = 10,
      prep = 3
    } = options;

    update(id, {
      difficulty: "簡単",
      prepTime: prep,
      cookTime: minutes,
      totalTime: prep + minutes + 4,

      // 水量は確定していないため別管理
      cookingLiquids: [{
        name: "水",
        amount: null,
        unit: "ml",
        status: "調理目安",
        note: "食材が十分にやわらかくなる量を使用。鍋の大きさや加熱方法に応じて調整する。"
      }],

      stepsDetailed: [
        step(
          "食材を準備する",
          preparation,
          prep
        ),
        step(
          "十分に加熱する",
          heating,
          minutes
        ),
        smooth,
        cool
      ],

      detailStatus: "調理方法の目安・水量未検証"
    });
  }

  // =========================
  // ID 1：10倍がゆ
  // =========================

  update(1, {
    difficulty: "普通",

    // 既存の「米がゆ30g」は完成したおかゆ
    // として扱い、材料を勝手に生米へ変更しない
    prepTime: 2,
    cookTime: 5,
    totalTime: 7,

    cookingLiquids: [{
      name: "水",
      amount: null,
      unit: "ml",
      status: "調理目安",
      note: "完成済みの10倍がゆを温める場合、必要に応じて加える。生米から作る場合は米1：水10が基本比率。"
    }],

    stepsDetailed: [
      step(
        "おかゆを準備する",
        "完成済みの10倍がゆ30gを用意する。生米から作る場合は、米と水を重量比で1：10にして十分にやわらかく炊く。",
        2
      ),
      step(
        "温める",
        "おかゆを鍋に入れて温める。水分が少ない場合は湯を少しずつ加える。",
        5
      ),
      step(
        "裏ごしする",
        "米粒が残らないように、すりつぶすか裏ごししてなめらかにする。",
        2
      ),
      cool
    ],

    detailStatus: "完成済みおかゆ使用・加水量は調理目安"
  });

  // =========================
  // ID 2〜14：野菜ペースト
  // =========================

  vegetablePaste(2, {
    food: "にんじん",
    preparation:
      "にんじんの皮をむき、薄い輪切りにする。",
    heating:
      "鍋ににんじんと水を入れ、弱めの火で十分にやわらかくなるまで煮る。"
  });

  vegetablePaste(3, {
    food: "かぼちゃ",
    preparation:
      "かぼちゃの種とワタを除き、小さく切る。",
    heating:
      "蒸すか、少量の水で十分にやわらかく加熱する。加熱後に皮を除く。"
  });

  vegetablePaste(4, {
    food: "じゃがいも",
    preparation:
      "じゃがいもの皮と芽を取り除き、小さく切る。",
    heating:
      "鍋で十分にやわらかくゆでる。ゆで上がったら湯を切り、必要に応じて湯を加えてのばす。"
  });

  vegetablePaste(5, {
    food: "さつまいも",
    preparation:
      "さつまいもの皮を厚めにむき、小さく切って水にさらす。",
    heating:
      "鍋で十分にやわらかくなるまでゆでる。"
  });

  vegetablePaste(6, {
    food: "ほうれん草",
    preparation:
      "ほうれん草をよく洗い、やわらかい葉先を使う。",
    heating:
      "十分にゆでて水に取り、細かく刻んでからすりつぶす。"
  });

  vegetablePaste(7, {
    food: "小松菜",
    preparation:
      "小松菜をよく洗い、やわらかい葉先を使う。",
    heating:
      "葉先を十分にやわらかくゆで、細かく刻む。"
  });

  vegetablePaste(8, {
    food: "ブロッコリー",
    preparation:
      "ブロッコリーをよく洗い、やわらかい穂先を使う。",
    heating:
      "穂先を十分にやわらかくゆでる。"
  });

  vegetablePaste(9, {
    food: "大根",
    preparation:
      "大根の皮を厚めにむき、薄く切る。",
    heating:
      "鍋で十分にやわらかくなるまで煮る。"
  });

  vegetablePaste(10, {
    food: "かぶ",
    preparation:
      "かぶの皮をむき、小さく切る。",
    heating:
      "鍋で十分にやわらかくなるまでゆでる。"
  });

  vegetablePaste(11, {
    food: "白菜",
    preparation:
      "白菜をよく洗い、やわらかい葉の部分を細かく切る。",
    heating:
      "鍋で十分にやわらかくなるまで煮る。"
  });

  vegetablePaste(12, {
    food: "キャベツ",
    preparation:
      "キャベツの硬い芯を除き、葉を細かく切る。",
    heating:
      "鍋で十分にやわらかくなるまで煮る。"
  });

  vegetablePaste(13, {
    food: "玉ねぎ",
    preparation:
      "玉ねぎの皮をむき、薄切りにする。",
    heating:
      "辛みが残らないよう、十分にやわらかくなるまで煮る。"
  });

  vegetablePaste(14, {
    food: "トマト",
    preparation:
      "トマトの皮と種を除き、果肉を小さく切る。",
    heating:
      "鍋で果肉を十分に加熱してやわらかくする。",
    minutes: 5
  });

  // =========================
  // ID 15〜19：果物ペースト
  // =========================

  function fruitPaste(id, preparation, heating) {
    update(id, {
      difficulty: "簡単",
      prepTime: 3,
      cookTime: 5,
      totalTime: 10,

      cookingLiquids: [],

      stepsDetailed: [
        step("果物を準備する", preparation, 3),
        step("食べやすくする", heating, 5),
        step(
          "仕上げる",
          "必要に応じて裏ごしし、なめらかな状態にする。",
          1
        ),
        cool
      ],

      detailStatus: "調理手順の目安"
    });
  }

  fruitPaste(
    15,
    "りんごの皮と芯を取り除き、小さく切る。",
    "少量の水を加えてやわらかく加熱し、すりつぶす。"
  );

  fruitPaste(
    16,
    "完熟バナナの皮をむき、筋を取り除く。",
    "フォークなどで粒が残らないようになめらかにつぶす。"
  );

  fruitPaste(
    17,
    "桃の皮と種を取り除き、小さく切る。",
    "やわらかさを確認し、必要に応じて加熱してすりつぶす。"
  );

  fruitPaste(
    18,
    "梨の皮と芯を取り除き、小さく切る。",
    "少量の水を加えてやわらかく加熱し、すりつぶす。"
  );

  fruitPaste(
    19,
    "みかんの外皮、薄皮、種を丁寧に取り除く。",
    "果肉を細かくつぶし、なめらかな状態にする。"
  );

  // =========================
  // ID 20〜23：たんぱく質
  // =========================

  function proteinPaste(id, preparation, heating) {
    update(id, {
      difficulty: "普通",
      prepTime: 4,
      cookTime: 10,
      totalTime: 17,

      cookingLiquids: [{
        name: "水",
        amount: null,
        unit: "ml",
        status: "調理目安",
        note: "加熱や仕上げに必要な量を使用する。"
      }],

      stepsDetailed: [
        step("下準備", preparation, 4),
        step("十分に加熱する", heating, 10),
        step(
          "なめらかにする",
          "細かくほぐし、必要に応じて湯を加え、飲み込みやすい状態にする。",
          2
        ),
        cool
      ],

      detailStatus: "調理方法の目安・水量未検証"
    });
  }

  proteinPaste(
    20,
    "豆腐を必要量取り分ける。",
    "豆腐を中心まで十分に加熱する。"
  );

  proteinPaste(
    21,
    "白身魚の皮と骨を取り除く。",
    "白身魚を中心まで十分に加熱し、骨が残っていないことを再確認する。"
  );

  proteinPaste(
    22,
    "しらすを用意し、必要に応じて細かくする。",
    "しらすを湯通しして塩抜きし、十分に加熱する。"
  );

  update(23, {
    difficulty: "普通",
    prepTime: 2,
    cookTime: 15,
    totalTime: 20,

    cookingLiquids: [{
      name: "水",
      amount: null,
      unit: "ml",
      status: "調理目安",
      note: "卵をゆでるための水。鍋の大きさに応じて調整する。"
    }],

    stepsDetailed: [
      step(
        "卵を準備する",
        "卵を用意する。卵を初めて食べる場合は、体調のよい日にごく少量から始める。",
        2
      ),
      step(
        "固ゆでにする",
        "卵を十分にゆで、黄身も白身も完全に固まった状態にする。",
        15
      ),
      step(
        "卵黄を取り出す",
        "殻をむき、固まった卵黄を取り出す。",
        1
      ),
      step(
        "なめらかにする",
        "卵黄を必要量取り分け、湯などでのばしてなめらかにする。",
        2
      ),
      cool
    ],

    detailStatus: "調理手順の目安・水量未検証"
  });

  // =========================
  // ID 24〜38：具入りおかゆ
  // =========================

  const porridgeData = [
    [24, "にんじん", "皮をむいて薄く切り、やわらかく煮てすりつぶす。"],
    [25, "かぼちゃ", "種とワタを除いて加熱し、皮を除いてすりつぶす。"],
    [26, "さつまいも", "皮をむいて小さく切り、やわらかくゆでてつぶす。"],
    [27, "ほうれん草", "葉先を十分にゆで、細かく刻んですりつぶす。"],
    [28, "小松菜", "葉先を十分にゆで、細かく刻んですりつぶす。"],
    [29, "ブロッコリー", "穂先を十分にゆで、細かくすりつぶす。"],
    [30, "大根", "皮をむいて薄く切り、やわらかく煮てすりつぶす。"],
    [31, "かぶ", "皮をむいて小さく切り、やわらかく煮てすりつぶす。"],
    [32, "白菜", "やわらかい葉を細かく切り、十分に煮てすりつぶす。"],
    [33, "キャベツ", "硬い芯を除き、葉を十分に煮てすりつぶす。"],
    [34, "玉ねぎ", "薄切りにして十分に煮て、すりつぶす。"],
    [35, "トマト", "皮と種を除いて加熱し、すりつぶす。"],
    [36, "豆腐", "中心まで十分に加熱し、なめらかにつぶす。"],
    [37, "白身魚", "中心まで十分に加熱し、皮と骨を除いて細かくほぐす。"],
    [38, "しらす", "湯通しして塩抜きし、細かくすりつぶす。"]
  ];

  porridgeData.forEach(function (item) {
    const id = item[0];
    const food = item[1];
    const preparation = item[2];

    update(id, {
      difficulty: "普通",
      prepTime: 5,
      cookTime: 15,
      totalTime: 23,

      cookingLiquids: [{
        name: "水",
        amount: null,
        unit: "ml",
        status: "調理目安",
        note: "完成済みのおかゆを使用。温める際の加水量は状態に応じて調整する。"
      }],

      stepsDetailed: [
        step(
          "材料を準備する",
          "完成済みの10倍がゆと" + food + "を用意する。",
          2
        ),
        step(
          "具材を調理する",
          preparation,
          10
        ),
        step(
          "おかゆと合わせる",
          "おかゆに調理した" + food +
          "を加え、全体を十分に温める。",
          5
        ),
        step(
          "なめらかにする",
          "粒が残らないように混ぜ、必要に応じて裏ごしする。",
          3
        ),
        cool
      ],

      detailStatus: "調理手順の目安・水量未検証"
    });
  });

  // =========================
  // ID 39〜40：野菜の組み合わせ
  // =========================

  update(39, {
    difficulty: "普通",
    prepTime: 4,
    cookTime: 12,
    totalTime: 19,

    cookingLiquids: [{
      name: "水",
      amount: null,
      unit: "ml",
      status: "調理目安",
      note: "かぼちゃを加熱する際に必要な量を使用する。"
    }],

    stepsDetailed: [
      step(
        "かぼちゃを準備する",
        "かぼちゃの種とワタを除き、小さく切る。",
        3
      ),
      step(
        "かぼちゃを加熱する",
        "十分にやわらかく加熱し、皮を除いてつぶす。",
        10
      ),
      step(
        "豆腐を加熱する",
        "豆腐を中心まで十分に加熱してつぶす。",
        3
      ),
      step(
        "混ぜ合わせる",
        "かぼちゃと豆腐を合わせ、なめらかになるまで混ぜる。",
        2
      ),
      cool
    ],

    detailStatus: "調理手順の目安・水量未検証"
  });

  update(40, {
    difficulty: "普通",
    prepTime: 4,
    cookTime: 12,
    totalTime: 19,

    cookingLiquids: [{
      name: "水",
      amount: null,
      unit: "ml",
      status: "調理目安",
      note: "野菜をゆでるための水。鍋の大きさに応じて調整する。"
    }],

    stepsDetailed: [
      step(
        "野菜を準備する",
        "にんじんとじゃがいもの皮をむき、小さく切る。じゃがいもの芽は取り除く。",
        4
      ),
      step(
        "やわらかく煮る",
        "鍋に野菜と水を入れ、両方が十分にやわらかくなるまで煮る。",
        12
      ),
      step(
        "すりつぶす",
        "にんじんとじゃがいもを合わせ、なめらかになるまですりつぶす。",
        2
      ),
      cool
    ],

    detailStatus: "調理手順の目安・水量未検証"
  });

  console.log(
    "Ver.6：最初の40品に詳細データを追加しました"
  );

})();
