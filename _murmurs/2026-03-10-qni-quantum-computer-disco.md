---
title: "量子コンピューターディスコの例を数式とQniで追う🪩"
date: 2026-03-10
tags: [量子コンピューターディスコ]
math: true
---

<div class="note">
<strong>TL;DR</strong><br>
<ul>
  <li>量子計算とDJ操作のメタファー対応確認</li>
  <li>公式動画の例を実際に行列で計算</li>
  <li>Webシミュレーター「Qni」による再現</li>
</ul>
</div>

## 序論

[先日、本サイトでもご紹介した]({{ '/murmurs/2026-02-27-miraikan/' | relative_url }})日本科学未来館の展示「量子コンピューターディスコ」。
実はまだ実際に体験はできていないのですが、現地に行く前にその仕組みを予習しておきたいと思い、この記事を書きました。

<div class="note">
<strong>注.</strong> 著者は未来館とはなんの関係もない、ただの量子コンピューターディスコをとても気に入っている大学院生です。そのため、ここに書かれていることは公開情報と自分の理解にもとづくものであり、展示の公式解説ではありません。
</div>

## 「量子コンピューターディスコ」の設計

まずは、展示のコンセプトを確認します。

未来館の公式ページでは、DJ 体験を通して量子コンピュータのプログラミングを理解できる展示として紹介されています。<span id="cite-1"></span>[[1]](#ref-1)

この記事<span id="cite-2"></span>[[2]](#ref-2)では、以下のように説明されています。

> ユニークなのは、各性質をDJ卓での作業になぞらえた点だ。「重ね合わせ」は2つ以上の楽曲をミックス（同時に流す）した状態、「位相」はヘッドホンから流れてくる音のサラウンド感、「もつれ」はスクリーン上で隣り合わせになっていない楽曲同士をミックスする行為、そして「測定」はゲートの組み合わせを踏まえて計算された確率をもとに最終的にダンスフロアに流すことができた楽曲で表現される。音を操るうちに、4つの量子の性質が流したい楽曲を流せる確率（＝量子計算の確率）にどんな影響をもたらすのか、イメージできるようになるのだ。


つまり、量子計算の性質と DJ 操作のメタファーは次のように対応しています。

<table class="qc-map-table">
  <thead>
    <tr>
      <th>量子計算の性質</th>
      <th>DJ 操作での表現</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>重ね合わせ</td>
      <td>複数曲を同時にミックスして流している状態</td>
    </tr>
    <tr>
      <td>位相</td>
      <td>ヘッドホンでのサラウンド感の変化</td>
    </tr>
    <tr>
      <td>もつれ</td>
      <td>画面上で隣り合っていない曲同士をミックスする行為</td>
    </tr>
    <tr>
      <td>測定</td>
      <td>ゲートの組み合わせで計算された確率をもとに、最終的にフロアに流れる曲が 1 曲に確定する</td>
    </tr>
  </tbody>
</table>


## 公式動画の例

<iframe width="560" height="315" src="https://www.youtube.com/embed/6dMWkMNlawM?si=QyshYR1UJsiJHwoO&amp;start=33" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

![公式動画の例（スクリーンショット）]({{ '/assets/images/murmurs/qni-quantum-computer-disco/youtube_disco_example.png' | relative_url }})

公式の説明動画の例では、上記のような回路を用いて説明されています。<span id="cite-3"></span>[[3]](#ref-3)


## 行列で実際に計算

動画の例では、上2本のレーンだけにゲートが置かれていて、3本目のレーンには何も置かれていません。
したがって、この回路は実質的には上2量子ビットの回路として計算できます。

なお、以下では

- 上から順に並ぶ量子ビットを $(q_0,q_1,q_2)$
- 基底順を $\lvert q_0q_1q_2\rangle = \lvert 000\rangle,\lvert 001\rangle,\dots,\lvert 111\rangle$

とします。

動画の例を、上2量子ビットに対する回路として読むと、

$$

X,\;X,\;H,\;\phi(\pi/2),\;H,\;\mathrm{CNOT}_{0\to1},\;X

$$

がこの順に作用しているとみなせます。したがって出力状態は

$$

|\psi_{\mathrm{out}}\rangle
=
(X\otimes I)\,
\mathrm{CNOT}_{0\to1}\,
(H\otimes I)\,
(\phi(\pi/2)\otimes I)\,
(H\otimes I)\,
(X\otimes I)\,
(X\otimes I)\,
|00\rangle

$$

です。

最初の $X$ が2回続いているので、

$$

(X\otimes I)(X\otimes I)=I\otimes I

$$

より、

$$

|\psi_{\mathrm{out}}\rangle
=
(X\otimes I)\,
\mathrm{CNOT}_{0\to1}\,
\bigl(H\phi(\pi/2)H \otimes I\bigr)\,
|00\rangle

$$

となります。

### [1] 1量子ビット部分 $H\phi(\pi/2)H$ を計算

まず各行列は

$$

H=\frac{1}{\sqrt 2}
\begin{pmatrix}
1 & 1\\
1 & -1
\end{pmatrix},
\qquad
\phi(\pi/2)=
\begin{pmatrix}
1 & 0\\
0 & i
\end{pmatrix}

$$

です。

したがって

$$

H\phi(\pi/2)H
=
\frac12
\begin{pmatrix}
1 & 1\\
1 & -1
\end{pmatrix}
\begin{pmatrix}
1 & 0\\
0 & i
\end{pmatrix}
\begin{pmatrix}
1 & 1\\
1 & -1
\end{pmatrix}

$$

を計算すると、

$$

H\phi(\pi/2)H
=
\frac12
\begin{pmatrix}
1+i & 1-i\\
1-i & 1+i
\end{pmatrix}

$$

です。

### [2] 上 2 量子ビットでの行列にする

$$

H\phi(\pi/2)H \otimes I
=
\frac12
\begin{pmatrix}
1+i & 0 & 1-i & 0\\
0 & 1+i & 0 & 1-i\\
1-i & 0 & 1+i & 0\\
0 & 1-i & 0 & 1+i
\end{pmatrix}

$$

また、

$$

\mathrm{CNOT}_{0\to1}
=
\begin{pmatrix}
1&0&0&0\\
0&1&0&0\\
0&0&0&1\\
0&0&1&0
\end{pmatrix},
\qquad
X\otimes I
=
\begin{pmatrix}
0&0&1&0\\
0&0&0&1\\
1&0&0&0\\
0&1&0&0
\end{pmatrix}

$$

です。

初期状態は

$$

|00\rangle=
\begin{pmatrix}
1\\
0\\
0\\
0
\end{pmatrix}

$$

です。

### [3] 実際に順に掛ける

#### (a) $H\phi(\pi/2)H \otimes I$ を作用

$$

\frac12
\begin{pmatrix}
1+i & 0 & 1-i & 0\\
0 & 1+i & 0 & 1-i\\
1-i & 0 & 1+i & 0\\
0 & 1-i & 0 & 1+i
\end{pmatrix}
\begin{pmatrix}
1\\
0\\
0\\
0
\end{pmatrix}
=
\frac12
\begin{pmatrix}
1+i\\
0\\
1-i\\
0
\end{pmatrix}

$$

つまり

$$

\frac12\bigl((1+i)|00\rangle + (1-i)|10\rangle\bigr)

$$

です。

#### (b) つぎに CNOT

$$

\begin{pmatrix}
1&0&0&0\\
0&1&0&0\\
0&0&0&1\\
0&0&1&0
\end{pmatrix}
\frac12
\begin{pmatrix}
1+i\\
0\\
1-i\\
0
\end{pmatrix}
=
\frac12
\begin{pmatrix}
1+i\\
0\\
0\\
1-i
\end{pmatrix}

$$

つまり

$$

\frac12\bigl((1+i)|00\rangle + (1-i)|11\rangle\bigr)

$$

です。

#### (c) 最後に $X\otimes I$

$$

\begin{pmatrix}
0&0&1&0\\
0&0&0&1\\
1&0&0&0\\
0&1&0&0
\end{pmatrix}
\frac12
\begin{pmatrix}
1+i\\
0\\
0\\
1-i
\end{pmatrix}
=
\frac12
\begin{pmatrix}
0\\
1-i\\
1+i\\
0
\end{pmatrix}

$$

したがって

$$

|\psi_{\mathrm{out}}\rangle
=
\frac12\bigl((1-i)|01\rangle + (1+i)|10\rangle\bigr)

$$

です。

### [4] 3量子ビットに戻す

3 本目の量子ビット $q_2$ はずっと $\lvert 0\rangle$ のままなので、

$$

|\psi_{\mathrm{out}}^{(3)}\rangle
=
\frac12\bigl((1-i)|010\rangle + (1+i)|100\rangle\bigr)

$$

です。

### [5] 8次元ベクトルで書くと

基底順

$$

|000\rangle,|001\rangle,|010\rangle,|011\rangle,|100\rangle,|101\rangle,|110\rangle,|111\rangle

$$

に従えば、

$$

|000\rangle
=
\begin{pmatrix}
1\\
0\\
0\\
0\\
0\\
0\\
0\\
0
\end{pmatrix}
\quad\longmapsto\quad
\begin{pmatrix}
0\\
0\\
(1-i)/2\\
0\\
(1+i)/2\\
0\\
0\\
0
\end{pmatrix}

$$

です。

このベクトルは

- $\lvert 010\rangle$ の振幅が $(1-i)/2$
- $\lvert 100\rangle$ の振幅が $(1+i)/2$

で、それ以外は 0 です。

したがって測定確率は

$$

P(010)=\frac12,\qquad P(100)=\frac12

$$

となります。

## Qniでシミュレーション

こちらの記事<span id="cite-4"></span>[[4]](#ref-4)を拝見して、量子コンピューターディスコの背景には、ブラウザ上で量子回路のシミュレーションができるWebサービス「Qni」の存在があると知りました。<span id="cite-7"></span>[[7]](#ref-7)<span id="cite-8"></span>[[8]](#ref-8)

そこで、先ほどの回路の例を Qni でシミュレーションしてみました。

![Qniで再現した回路]({{ '/assets/images/murmurs/qni-quantum-computer-disco/qni_disco_example.png' | relative_url }})

[本回路のURLはこちら](https://qniapp.net/%7B%22cols%22%3A%5B%5B%22%7C0%3E%22%2C%22%7C0%3E%22%2C%22%7C0%3E%22%5D%2C%5B%22X%22%5D%2C%5B%22X%22%5D%2C%5B%22H%22%5D%2C%5B%22P(%CF%80_2)%22%5D%2C%5B%22H%22%5D%2C%5B%22%E2%80%A2%22%2C%22X%22%5D%2C%5B%22X%22%5D%2C%5B%22Measure%22%2C%22Measure%22%2C%22Measure%22%5D%5D%2C%22title%22%3A%22%E9%87%8F%E5%AD%90%E3%82%B3%E3%83%B3%E3%83%94%E3%83%A5%E3%83%BC%E3%82%BF%E3%83%BC%E3%83%87%E3%82%A3%E3%82%B9%E3%82%B3%E4%BE%8B%22%7D)。

実際、このページを繰り返しリロードすると、その確率に応じて最後の測定の値が変わることが確認できます。
(また、Qniでは、量子ビットの状態をブロッホ球の形で可視化できます! 凄い! )

## 今後の展望

こちらのレポート記事 <span id="cite-5"></span>[[5]](#ref-5) には、

> ゲートは12種類合計60個あります。

と書かれており、

また、こちらの記事 <span id="cite-6"></span>[[6]](#ref-6) の写真からは、MS(Mølmer-Sørensen)ゲートらしき存在も確認できます。
(3量子ビットにまたがるORAは何を表しているのでしょうか…?)

つまり、基本的な量子論理ゲートだけではなく、他にもいろいろな種類のゲートがあるようです。

今度現地に行った際に種類を確認して、またブログで紹介しようと思います。

## 参考文献

<ol class="refs-list">
  <li id="ref-1">
    日本科学未来館「量子コンピュータ・ディスコ」<br>
    <a href="https://www.miraikan.jst.go.jp/exhibitions/future/qcdisco/">https://www.miraikan.jst.go.jp/exhibitions/future/qcdisco/</a>
    <a href="#cite-1" aria-label="本文の参照箇所へ戻る">↩</a>
  </li>
  <li id="ref-2">
    WIRED「テーマは『宇宙』と『量子コンピューター』：日本科学未来館でスタートした2つの新展示」<br>
    <a href="https://wired.jp/article/quantum-computer-disco-the-universe-unread-messages/">https://wired.jp/article/quantum-computer-disco-the-universe-unread-messages/</a>
    <a href="#cite-2" aria-label="本文の参照箇所へ戻る">↩</a>
  </li>
  <li id="ref-3">
    量子コンピュータがわかるショートムービー PART4「量子コンピュータでどうやって計算するの？」<br>
    <a href="https://www.youtube.com/watch?v=6dMWkMNlawM">https://www.youtube.com/watch?v=6dMWkMNlawM</a>
    <a href="#cite-3" aria-label="本文の参照箇所へ戻る">↩</a>
  </li>
  <li id="ref-4">
    TIS INTEC Group MAGAZINE「『次世代につながる、量子コンピュータとの出会い』を叶える。」<br>
    <a href="https://www.tis.co.jp/group_magazine/interview/07/">https://www.tis.co.jp/group_magazine/interview/07/</a>
    <a href="#cite-4" aria-label="本文の参照箇所へ戻る">↩</a>
  </li>
  <li id="ref-5">
    Kids Event Report「日本科学未来館で『量子コンピュータ』『宇宙研究の最前線』を体験！」<br>
    <a href="https://www.kids-event.jp/report/12617/">https://www.kids-event.jp/report/12617/</a>
    <a href="#cite-5" aria-label="本文の参照箇所へ戻る">↩</a>
  </li>
  <li id="ref-6">
    Impress Watch「お台場の未来館で『量子コンピュータ』を体験した 宇宙観測の最前線も」<br>
    <a href="https://www.watch.impress.co.jp/docs/news/2009478.html">https://www.watch.impress.co.jp/docs/news/2009478.html</a>
    <a href="#cite-6" aria-label="本文の参照箇所へ戻る">↩</a>
  </li>
  <li id="ref-7">
    Qni Tutorial<br>
    <a href="https://qniapp.github.io/qni/">https://qniapp.github.io/qni/</a>
    <a href="#cite-7" aria-label="本文の参照箇所へ戻る">↩</a>
  </li>
  <li id="ref-8">
    Qni 初期回路URL（空の回路）<br>
    <a href="https://qniapp.net/%7B%22cols%22%3A%5B%5D%7D">https://qniapp.net/%7B%22cols%22%3A%5B%5D%7D</a>
    <a href="#cite-8" aria-label="本文の参照箇所へ戻る">↩</a>
  </li>
</ol>
