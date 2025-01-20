


### 象棋引擎
- [Pikafish](https://github.com/official-pikafish/Pikafish)
- [Stockfish](https://stockfishchess.org/)

搜索算法 
https://github.com/lhttjdr/xiangqi/blob/master/doc/1.%20Introduction.md



## Related Research

- [Mastering Chinese Chess AI(Xiangqi) Without Search](https://arxiv.org/html/2410.04865v1) Juntong Lin, Zhichao Shu, Yu Chen LIGHTSPEED STUDIOS, Tencent, China
- [Neural Networks for Chess](https://arxiv.org/abs/2209.01506)
- [中国象棋Zero（CCZero）
](https://github.com/NeymarL/ChineseChess-AlphaZero)
- [ElephantChess](https://elephantchess.io/about)
- [ChessBase](https://www.chessbase.com/en/home)
- [Chess.com](https://www.chess.com/)
- [Lichess](https://lichess.org/)
- [Chess.com](https://www.chess.com/)
- [Chess.com](https://www.chess.com/)



1. Reinforcement Learning and Classical AI for Xiangqi

AlphaZero-like approaches
"AlphaZero for Xiangqi": Several community-driven projects and smaller-scale academic endeavors have applied the AlphaZero paradigm (deep neural network + MCTS) to Xiangqi. You may find open-source efforts on GitHub if you search for “Xiangqi AlphaZero.”
Search-based Xiangqi engines: Traditional Xiangqi engines (e.g. Elephant, Cyclone, MaxQi, CCZh) do not use LLMs. They rely on powerful evaluation functions with alpha-beta search. These are strong engines but differ fundamentally from LLM-driven approaches.
While these aren’t language models, they are directly relevant because they illustrate the current state-of-the-art for “intelligent” Chinese Chess play.

2. LLMs in Board Games: Why Not Common (Yet)?

Large language models excel in language understanding, reasoning (in a broad sense), and code generation—but they’re not optimized out-of-the-box for perfect or near-perfect play in well-defined board games like Chess, Go, or Xiangqi. For classical board games:

State & action space: Xiangqi is highly combinatorial. LLMs typically reason in text tokens, not in game-tree expansions.
Precision needed: Xiangqi has a “correct move,” or at least a highly optimized move, at each state. LLMs tend to generate text in a probabilistic manner and can drift into suboptimal or illegal moves.
Search requirement: Even with an LLM’s reasoning ability, thorough exploration of game states still benefits from search algorithms (MCTS or alpha-beta).
Hence, as of 2023–2024, few researchers have tried building a purely LLM-powered Xiangqi agent. Most prefer specialized search or deep RL methods.

3. Hybrid Approaches: LLM + Search

Although not Xiangqi-specific, there is emerging work in combining an LLM with a game-tree or MCTS-like approach—essentially letting an LLM guide or prune the search. For example:

LLM for move pruning: You can imagine prompting an LLM with the current board state (encoded in textual form) to suggest candidate moves, then passing those moves to a classical Xiangqi search engine for deeper evaluation.
LLM for strategic explanation: An LLM could be used to provide natural-language commentary or strategic analysis of a Xiangqi position. This is where LLMs shine—explaining why a certain move is strong—rather than purely for move generation.
While there’s no high-profile open-source project yet that uses GPT-4 (or a similar LLM) in this hybrid Xiangqi search pipeline, this approach is conceptually straightforward and might well appear soon in experimentation or hobby projects.

4. Evidence of Ongoing Experiments

Though no large-scale academic publications or commercial products stand out, you might find smaller experiments or side projects if you dig into:

GitHub
Look for repositories combining “Xiangqi” with “GPT,” “LLM,” or “ChatGPT.” Sometimes individual developers experiment with hooking up ChatGPT’s API to an existing Xiangqi engine.
Chinese AI forums and WeChat groups
Xiangqi has a strong fan base in Chinese AI circles, and you might see small-scale LLM experiments shared in university labs or hobby groups.
Papers on arXiv
Searching for “Large Language Models” + “Xiangqi” or “Chinese Chess” on arxiv.org might uncover early-stage technical reports.
Given the success of GPT-4 and similar models at “reasoning tasks,” it’s likely that over the next year or two, you’ll see prototypes or published papers exploring LLM-based Xiangqi agents—most likely hybrid systems that also use search or RL for move-quality guarantees.

