---
title: "反応拡散モデルでかめちゃんの模様を生成するプログラムを作る🐢"
date: 2026-02-21
tags: [亀]
math: true
---

<div class="note">
<strong>TL;DR</strong><br>
<ul>
  <li>愛亀「かめちゃん」の模様を数学的に再現することに挑戦。</li>
  <li>「反応拡散モデル（Gray-Scottモデル）」を用いてシミュレーション。</li>
  <li>パラメータ調整により、かめちゃんの顔周りにある複雑な網目模様に近い相を再現。</li>
</ul>
</div>

##序論

先日、東大の学校推薦型選抜で亀の研究をしていた高校生が合格したとのニュースを拝見しました。<span id="cite-1"></span>[[1]](#ref-1)

> 小学1年の頃から自宅近くで捕まえたクサガメやイシガメを飼育し、カメに迷路を解かせたり、甲羅の模様を数学的に解析したりする研究に取り組んできた。生物の能力を応用したロボットやAI（人工知能）の研究開発に携わりたいと考え、合格すると1年次から専門的な講義を受けられる東大の学校推薦型選抜に挑んだ。

とても面白そうです。カメはいいですよね。

私も小学4年生の時から実家でクサガメを飼育しています。（名前はかめちゃん）

![かめちゃん]({{ '/kamechan.JPG' | relative_url }})

（ところで、愛亀はなんと読むのでしょう。愛犬や愛猫から類推するに、湯桶読みをして「あいき」でしょうか）

亀が好きすぎて、中高では科学部生物班に所属しておりました。（部室ではカミツキガメとミシシッピアカミミガメを飼育）

大学では一見関連の薄い情報理工学を専攻していますが、アラン・チューリングについて調べる中で Turing Pattern の存在を知りました。

生物の縞模様や斑点模様のような自然の模様が、ごくシンプルな数理モデルから立ち上がるという話がとても面白いです。

こちらが元論文です。<span id="cite-2"></span>[[2]](#ref-2)

こちらの資料の説明もとてもわかりやすくて、面白いです。<span id="cite-5"></span>[[5]](#ref-5)

## かめちゃんの模様をシミュレーションしてみた🐢

そこで、愛亀・かめちゃん（クサガメ、メス）の頬や首元にある独特な迷路状のウネウネ模様を、反応拡散モデルで生成してみました🐢

<div class="note">
<strong>注.</strong> クサガメの模様が反応拡散モデルで説明できると主張したいわけではありません。ここでは「模様生成の数理を楽しむ」寄りの試みです。
</div>

今回作成したプログラムでは、反応拡散系の中でも複雑で美しい模様を描く Gray-Scott（グレイ・スコット）モデルを採用しています。<span id="cite-3"></span>[[3]](#ref-3)<span id="cite-4"></span>[[4]](#ref-4)

数式で表すと以下のようになります。

$$
\begin{aligned}
\frac{\partial U}{\partial t} &= D_u \nabla^2 U - UV^2 + F(1-U) \\
\frac{\partial V}{\partial t} &= D_v \nabla^2 V + UV^2 - (F+k)V
\end{aligned}
$$

作成したプログラムはこちら：
<https://github.com/chansaki3108341/kamechan_pattern.git>

## 生成結果

![生成結果]({{ '/example.png' | relative_url }})

パラメータを試行錯誤した結果、かめちゃんの顔周りにある、あの生命感あふれる網目のような模様がうまく再現できた気がします。

情報科学や数学の力を使って、自然界の美しさや愛するペットの模様を再現できるのは本当にワクワクする体験ですね🐢

## 余談

図書館で『数学セミナー』の最新号（2026年3月号）の特集「医療に活きる数理の威力」をパラ読みしていたら、「蕁麻疹の数理モデル」という記事があり、ここでも反応拡散モデルが出てきました。とても興味深いです。<span id="cite-6"></span>[[6]](#ref-6)<span id="cite-7"></span>[[7]](#ref-7)

## 参考文献

<ol class="refs-list">
  <li id="ref-1">
    北國新聞社「カメ研究で東大合格　金大附属高・部家さん「専門知識深めたい」　学校推薦型選抜で」<br>
    <a href="https://www.hokkoku.co.jp/articles/-/2016264">https://www.hokkoku.co.jp/articles/-/2016264</a>
    <a href="#cite-1" aria-label="本文の参照箇所へ戻る">↩</a>
  </li>
  <li id="ref-2">
    Alan M. Turing, <em>The Chemical Basis of Morphogenesis</em>, Philosophical Transactions of the Royal Society of London B, 1952.<br>
    <a href="https://doi.org/10.1098/rstb.1952.0012">https://doi.org/10.1098/rstb.1952.0012</a>
    <a href="#cite-2" aria-label="本文の参照箇所へ戻る">↩</a>
  </li>
  <li id="ref-3">
    P. Gray, S. K. Scott, <em>Autocatalytic reactions in the isothermal, continuous stirred tank reactor: Oscillations and instabilities in the system A + 2B -> 3B, B -> C</em>, Chemical Engineering Science 39(6), 1087-1097 (1984).
    <br><a href="https://doi.org/10.1016/0009-2509(84)87017-7">https://doi.org/10.1016/0009-2509(84)87017-7</a>
    <br><a href="https://www.sciencedirect.com/science/article/pii/0009250984870177">https://www.sciencedirect.com/science/article/pii/0009250984870177</a>
    <a href="#cite-3" aria-label="本文の参照箇所へ戻る">↩</a>
  </li>
  <li id="ref-4">
    John E. Pearson, <em>Complex Patterns in a Simple System</em>, Science 261(5118), 189-192 (1993).<br>
    <a href="https://doi.org/10.1126/science.261.5118.189">https://doi.org/10.1126/science.261.5118.189</a>
    <a href="#cite-4" aria-label="本文の参照箇所へ戻る">↩</a>
  </li>
  <li id="ref-5">
    近藤滋研究室（大阪大学）資料：反応拡散・チューリングパターン解説（Newton掲載資料PDF）<br>
    <a href="https://www.fbs.osaka-u.ac.jp/labs/skondo/download_files/Newton.pdf">https://www.fbs.osaka-u.ac.jp/labs/skondo/download_files/Newton.pdf</a>
    <a href="#cite-5" aria-label="本文の参照箇所へ戻る">↩</a>
  </li>
  <li id="ref-6">
    日本評論社『数学セミナー』2026年3月号（通巻773号）特集「医療に活きる数理の威力」／「皮膚疾患と数学，そして医学／蕁麻疹の数理モデル」（李 聖林）ほか.<br>
    <a href="https://www.nippyo.co.jp/shop/magazines/latest/4.html">https://www.nippyo.co.jp/shop/magazines/latest/4.html</a>
    <a href="#cite-6" aria-label="本文の参照箇所へ戻る">↩</a>
  </li>
  <li id="ref-7">
    Seirin-Lee S, Yanase Y, Takahagi S, Hide M, <em>A single reaction-diffusion equation for the multifarious eruptions of urticaria</em>, PLOS Computational Biology (2020).<br>
    <a href="https://doi.org/10.1371/journal.pcbi.1007590">https://doi.org/10.1371/journal.pcbi.1007590</a>
    <a href="#cite-7" aria-label="本文の参照箇所へ戻る">↩</a>
  </li>
</ol>
