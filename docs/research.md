

 AI engine 
 1. Fine-tuning LLM with Xiangqi data
 2. Complext Agent
 3. Specialized Neural Network engine like Stockfish 



Great posts on teaching LLM to play chess:
* [Something weird is happening with LLMs and chess](https://dynomight.net/chess/)
* [OK, I can partly explain the LLM chess weirdness now](https://dynomight.net/more-chess/)

* [Teaching a language model to play chess](https://medium.com/@tbarton_16336/teaching-a-language-model-to-play-chess-1ea69dde40fd)
This post fine-tunes a LLM on GPT-2 with chess data and then uses it to play chess. Old post but still relevant.
the Fine-tuning file format 

```sh
 <|startoftext|> 1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 a6 6. Be3 e6 7. g4 e5 8. Nf5 g6 9. g5 gxf5 10. exf5 d5 11. gxf6 d4 12. Bc4 Qc7 13. Qd3 dxe3 14. O-O-O exf2 15. Bxf7+ Kxf7 16. Qd5+ Kxf6 17. Ne4+ Ke7 18. Nd6 Bh6+ 19. Kb1 Kf6 20. Rhf1 Rf8 21. Rxf2 Nc6 22. Qc4 Kg7 23. Rg1+ Kh8 24. Rfg2 Bxf5 25. Nxf5 b5 26. Qe6 Nd4 27. Nxd4 Be3 28. Rg8+ Rxg8 29. Qf6+ Rg7 30. Ne6 Qf7 31. Qxg7+ Qxg7 32. Rxg7 Re8 33. Rg3 Bf4 34. Nc7 Rc8 35. Rc3 b4 36. Rc4 e4 37. Rxe4 Bxc7 38. h3 Rb8 39. Kc1 Kg8 40. Kd2 Rb5 41. Kd3 Be5 42. Kc4 Bxb2 43. Re6 Rh5 44. Kxb4 Rxh3 45. Rxa6 Ba3+ 46. Kc4 h5 47. Kd4 h4 48. c4 Rg3 49. Rh6 h3 50. Ke4 Kg7 51. Rh5 Bc1 <|endoftext|> 
 ```

 Basically, it tells the LLM the hisotry of the moves, and then the LLM will generate the next move.



[NNUE Efficiently updatable neural network](https://en.wikipedia.org/wiki/Efficiently_updatable_neural_network#:~:text=An%20efficiently%20updatable%20neural%20network,king%2Dpiece%2Dsquare%20table.)

### 象棋引擎
- [Pikafish](https://github.com/official-pikafish/Pikafish)
- [Stockfish](https://stockfishchess.org/)

搜索算法 
https://github.com/lhttjdr/xiangqi/blob/master/doc/1.%20Introduction.md




### NNUE


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

