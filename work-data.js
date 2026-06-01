/* Case-study content for the Work page. EN + 中文. */
window.PROJECTS = {
  atlas: {
    icon: 'neurology',
    cat: { en: 'AI / ML · Web', zh: 'AI / ML · 網頁' },
    title: { en: 'Atlas — AI research copilot', zh: 'Atlas — AI 研究副駕' },
    role: { en: 'Lead Product Designer', zh: '主創產品設計師' },
    timeline: { en: '2025 · 5 months', zh: '2025 · 5 個月' },
    team: { en: '2 designers, 4 engineers', zh: '2 設計 · 4 工程' },
    overview: {
      en: 'Atlas is a research workspace where analysts work alongside a reasoning model. The challenge: keep a human firmly in control of a system that thinks in long, branching chains.',
      zh: 'Atlas 是一個研究工作臺，分析師在其中與推理模型協作。挑戰在於：讓人類牢牢掌控一個會進行長鏈、分支式思考的系統。'
    },
    problem: {
      en: 'Early users trusted the model too much or not at all. Long reasoning traces were a wall of text — impossible to scan, hard to correct, easy to abandon.',
      zh: '早期用戶要麼過度信任模型，要麼完全不信。冗長的推理過程是一堵文字牆——難以瀏覽、難以糾正、容易放棄。'
    },
    approach: {
      en: 'I designed a steerable reasoning canvas: each step is a card you can pin, edit, or branch from. Confidence is shown as a quiet tonal scale, never a raw percentage. Corrections feed straight back into the next run.',
      zh: '我設計了可操控的推理畫布：每一步都是可固定、可編辑、可分支的卡片。置信度以柔和的色階呈現，而非生硬的百分比。修正會直接反饋到下一次運行。'
    },
    outcome: {
      en: 'Shipped to 1,200 internal analysts. Task completion rose sharply and trust scores moved from "skeptical" to "relies on it daily".',
      zh: '已交付給 1,200 名内部分析師。任務完成率顯著提升，信任度從“持懷疑態度”轉為“每天依賴”。'
    },
    metrics: [
      { n: '+38%', label: { en: 'Task completion', zh: '任務完成率' } },
      { n: '−52%', label: { en: 'Time to insight', zh: '洞察耗時' } },
      { n: '1.2k', label: { en: 'Daily analysts', zh: '日活分析師' } }
    ],
    tags: ['Reasoning UX', 'Trust & control', 'Design system']
  },

  loop: {
    icon: 'rocket_launch',
    cat: { en: '0→1 · Web', zh: '0→1 · 網頁' },
    title: { en: 'Loop — team retro, reinvented', zh: 'Loop — 重塑團隊復盤' },
    role: { en: 'Founding Designer', zh: '創始設計師' },
    timeline: { en: '2024 · 14 weeks', zh: '2024 · 14 周' },
    team: { en: '1 designer, 3 engineers', zh: '1 設計 · 3 工程' },
    overview: {
      en: 'Loop turns the team retrospective from a dreaded meeting into a living, async ritual. I owned design from the first whiteboard to public launch.',
      zh: 'Loop 把令人頭疼的團隊復盤會，變成一個持續進行的異步儀式。從第一塊白板到公開發布，我全程主導設計。'
    },
    problem: {
      en: 'Retros happen once a sprint, run long, and the action items vanish. Teams wanted reflection without the calendar tax.',
      zh: '復盤每個迭代才一次、時間冗長，行動項隨后不了了之。團隊想要反思，卻不想為它支付日曆成本。'
    },
    approach: {
      en: 'I framed retro as a continuous feed of small signals rather than one big meeting. A lightweight capture flow, sentiment over time, and action items that follow the team into the next sprint.',
      zh: '我把復盤重新定義為持續的小信號流，而非一場大會。輕量的記錄流程、隨時間變化的情緒曲線，以及會跟隨團隊進入下個迭代的行動項。'
    },
    outcome: {
      en: 'Launched on schedule. Weekly active teams grew steadily through the first quarter with strong word-of-mouth.',
      zh: '如期上線。首季度内每周活躍團隊穩步增長，口碑強勁。'
    },
    metrics: [
      { n: '14 wk', label: { en: '0→1 to launch', zh: '0→1 到上線' } },
      { n: '4.8', label: { en: 'App store rating', zh: '應用評分' } },
      { n: '3×', label: { en: 'Retro frequency', zh: '復盤頻率' } }
    ],
    tags: ['0→1', 'Product strategy', 'Brand']
  },

  pulse: {
    icon: 'monitor_heart',
    cat: { en: 'AI / ML · Mobile', zh: 'AI / ML · 移動端' },
    title: { en: 'Pulse — a calmer health companion', zh: 'Pulse — 更從容的健康夥伴' },
    role: { en: 'Product Designer', zh: '產品設計師' },
    timeline: { en: '2024 · 4 months', zh: '2024 · 4 個月' },
    team: { en: '2 designers, 5 engineers', zh: '2 設計 · 5 工程' },
    overview: {
      en: 'Pulse uses on-device ML to spot patterns in everyday health data and nudge gently — a companion, not a coach that shouts.',
      zh: 'Pulse 借助端側機器學習，從日常健康數據中發現規律並溫柔提醒——它是夥伴，而非大聲訓話的教練。'
    },
    problem: {
      en: 'Health apps overwhelm people with metrics and guilt. Engagement spikes, then craters within two weeks.',
      zh: '健康類應用用指標和愧疚感淹沒用戶。參與度先飆升，两周内便崩塌。'
    },
    approach: {
      en: 'I designed for restraint: one meaningful insight a day, framed positively, with all inference running privately on-device. Motion and haptics carry tone where words would feel preachy.',
      zh: '我以“克制”為原則：每天只給一條有意義、積極的洞察，所有推斷都在端側私密完成。在文字會顯得說教的地方，用動效與觸感傳遞語氣。'
    },
    outcome: {
      en: 'Two-week retention nearly doubled versus the previous app, and opt-out of notifications dropped dramatically.',
      zh: '两周留存率較舊版應用近乎翻倍，通知關閉率大幅下降。'
    },
    metrics: [
      { n: '+94%', label: { en: '2-week retention', zh: '两周留存' } },
      { n: '100%', label: { en: 'On-device inference', zh: '端側推斷' } },
      { n: '−61%', label: { en: 'Notification opt-out', zh: '通知關閉率' } }
    ],
    tags: ['On-device ML', 'Motion', 'Privacy']
  },

  forge: {
    icon: 'dashboard_customize',
    cat: { en: 'Design system · Web', zh: '設計系統 · 網頁' },
    title: { en: 'Forge — a system for fast teams', zh: 'Forge — 為高速團隊打造的系統' },
    role: { en: 'Design Systems Lead', zh: '設計系統負責人' },
    timeline: { en: '2023 · ongoing', zh: '2023 · 持續維護' },
    team: { en: '3 designers, 2 engineers', zh: '3 設計 · 2 工程' },
    overview: {
      en: 'Forge is the shared design language behind four product squads — tokens, components, and the docs that keep everyone honest.',
      zh: 'Forge 是支撐四個產品小隊的共享設計語言——令牌、組件，以及讓所有人保持一致的文檔。'
    },
    problem: {
      en: 'Four teams, four button styles, four definitions of "primary". Every new screen reinvented the basics and drifted further apart.',
      zh: '四個團隊、四種按鈕樣式、四種“主色”的定義。每個新頁面都在重造基礎，彼此越走越遠。'
    },
    approach: {
      en: 'I built a token-first system with semantic roles, then shipped a living component library with usage docs and contribution paths. Theming is a single seed swap.',
      zh: '我搭建了以令牌為先、帶語義角色的系統，並交付了一套含使用文檔與貢獻流程的活組件庫。換主題只需替換一個種子色。'
    },
    outcome: {
      en: 'Design-to-build handoff time fell sharply, and visual inconsistencies in QA dropped to a fraction of their former level.',
      zh: '設計到開發的交接時間大幅縮短，QA 中的視覺不一致問題降至原先的一小部分。'
    },
    metrics: [
      { n: '−45%', label: { en: 'Handoff time', zh: '交接耗時' } },
      { n: '120+', label: { en: 'Components', zh: '組件數量' } },
      { n: '4', label: { en: 'Squads aligned', zh: '對齊小隊' } }
    ],
    tags: ['Tokens', 'Governance', 'Documentation']
  },

  nomi: {
    icon: 'auto_awesome',
    cat: { en: '0→1 · Mobile', zh: '0→1 · 移動端' },
    title: { en: 'Nomi — onboarding that adapts', zh: 'Nomi — 會適應的引導流程' },
    role: { en: 'Interaction Designer', zh: '交互設計師' },
    timeline: { en: '2023 · 3 months', zh: '2023 · 3 個月' },
    team: { en: '1 designer, 2 engineers', zh: '1 設計 · 2 工程' },
    overview: {
      en: 'Nomi\'s first-run experience reshapes itself around what each new user tells it — no two onboardings are quite the same.',
      zh: 'Nomi 的首啟體驗會根據每位新用戶的輸入自我重塑——沒有两次引導是完全相同的。'
    },
    problem: {
      en: 'A one-size flow either bored power users or lost newcomers. Drop-off clustered on the third screen, every time.',
      zh: '一刀切的流程要麼讓高級用戶感到無聊，要麼讓新手迷失。流失總是集中在第三屏。'
    },
    approach: {
      en: 'I designed a branching flow driven by two early signals, with motion that makes each fork feel intentional rather than random. Progress is always visible and reversible.',
      zh: '我設計了由两個早期信號驅動的分支流程，用動效讓每次分叉顯得有意為之而非隨機。進度始終可見且可回退。'
    },
    outcome: {
      en: 'Activation through onboarding improved substantially, with the biggest gains among first-time users.',
      zh: '引導環節的激活率顯著提升，新手用戶的增益最為明顯。'
    },
    metrics: [
      { n: '+27%', label: { en: 'Activation', zh: '激活率' } },
      { n: '−40%', label: { en: 'Step-3 drop-off', zh: '第三屏流失' } },
      { n: '6', label: { en: 'Adaptive paths', zh: '自適應路徑' } }
    ],
    tags: ['Adaptive flow', 'Prototyping', 'Motion']
  },

  spectra: {
    icon: 'insights',
    cat: { en: 'AI / ML · Web', zh: 'AI / ML · 網頁' },
    title: { en: 'Spectra — making model output readable', zh: 'Spectra — 讓模型輸出可讀' },
    role: { en: 'Product Designer', zh: '產品設計師' },
    timeline: { en: '2022 · 6 months', zh: '2022 · 6 個月' },
    team: { en: '2 designers, 3 engineers', zh: '2 設計 · 3 工程' },
    overview: {
      en: 'Spectra is a visualisation layer that turns raw model output — scores, ranges, uncertainty — into something a non-expert can read at a glance.',
      zh: 'Spectra 是一個可視化層，把原始模型輸出（分數、區間、不確定性）轉化為非專家也能一眼讀懂的内容。'
    },
    problem: {
      en: 'Stakeholders saw a single confident number and made bets on it — even when the model was deeply unsure.',
      zh: '相關方只看到一個自信的數字便據此下注——哪怕模型其實極不確定。'
    },
    approach: {
      en: 'I introduced an honest visual grammar for uncertainty: distributions over point estimates, and clear visual cues when the model is out of its depth.',
      zh: '我為不確定性引入了一套誠實的視覺語法：用分布替代點估計，並在模型“力不從心”時給出清晰的視覺提示。'
    },
    outcome: {
      en: 'Decisions based on over-confident readings dropped, and stakeholder trust in the tool grew because it admitted what it didn\'t know.',
      zh: '基於過度自信讀數的決策減少了，而相關方對工具的信任反而提升——因為它會坦承自己的未知。'
    },
    metrics: [
      { n: '−33%', label: { en: 'Over-confident calls', zh: '過度自信決策' } },
      { n: '+21%', label: { en: 'Stakeholder trust', zh: '相關方信任' } },
      { n: '9', label: { en: 'Chart patterns', zh: '圖表模式' } }
    ],
    tags: ['Data viz', 'Uncertainty', 'Trust']
  }
};
