export interface FallbackProblem {
  id: number;
  question: string;
  options: string[];
  answer: number;
  explanation: string;
}

export const FALLBACK_PROBLEMS: Record<string, FallbackProblem[]> = {
  "基礎代數": [
    {
      id: 1,
      question: "解方程組 $\\begin{cases} 2x + 3y = 7 \\\\ 3x - y = 5 \\end{cases}$，求 $x + y$ 的值。",
      options: ["3", "4", "5", "6"],
      answer: 0,
      explanation: "將第二式兩邊乘以 3 得 $9x - 3y = 15$。與第一式相加相消得 $11x = 22 \\implies x = 2$。帶回第二式得 $6 - y = 5 \\implies y = 1$。因此 $x + y = 2 + 1 = 3$。"
    },
    {
      id: 2,
      question: "若一元二次方程式 $x^2 - 5x + k = 0$ 有兩個相異實根，求實數 $k$ 的最大整數值。",
      options: ["5", "6", "7", "8"],
      answer: 1,
      explanation: "方程有相異實根的條件為判別式 $\\Delta = b^2 - 4ac > 0$。代入計算得 $25 - 4k > 0 \\implies k < \\frac{25}{4} = 6.25$。故 $k$ 的最大整數值為 $6$。"
    },
    {
      id: 3,
      question: "若一等差數列的第 3 項為 $11$，第 8 項為 $26$，求其第 20 項的值。",
      options: ["59", "62", "65", "68"],
      answer: 1,
      explanation: "設首項為 $a_1$，公差為 $d$。由題意得：\n1. $a_3 = a_1 + 2d = 11$\n2. $a_8 = a_1 + 7d = 26$\n\n兩式相減得 $5d = 15 \\implies d = 3$，帶回得 $a_1 = 5$。\n因此第 20 項 $a_{20} = a_1 + 19d = 5 + 19 \\times 3 = 62$。"
    },
    {
      id: 4,
      question: "已知 $x + \\frac{1}{x} = 4$，求 $x^3 + \\frac{1}{x^3}$ 的值。",
      options: ["48", "52", "56", "64"],
      answer: 1,
      explanation: "根據乘法公式：$(x + \\frac{1}{x})^3 = x^3 + \\frac{1}{x^3} + 3(x + \\frac{1}{x})$。\n代入已知值 $4^3 = x^3 + \\frac{1}{x^3} + 3(4) \\implies 64 = x^3 + \\frac{1}{x^3} + 12 \\implies x^3 + \\frac{1}{x^3} = 52$。"
    },
    {
      id: 5,
      question: "試解二次不等式 $x^2 - 4x - 5 \\le 0$，求其解之實數區間。",
      options: ["$x \\le -1$", "$x \\ge 5$", "$-1 \\le x \\le 5$", "$-5 \\le x \\le 1$"],
      answer: 2,
      explanation: "將二次式因式分解得 $(x - 5)(x + 1) \\le 0$。其解落在兩根之間，即 $-1 \\le x \\le 5$。"
    },
    {
      id: 6,
      question: "若多項式 $f(x) = x^3 - 3x^2 + kx - 6$ 能被 $x - 2$ 整除，求 $k$ 的值。",
      options: ["2", "3", "4", "5"],
      answer: 3,
      explanation: "根據因式定理，若 $f(x)$ 可被 $x-2$ 整除，則 $f(2) = 0$。代入得 $2^3 - 3(2^2) + 2k - 6 = 0 \\implies 8 - 12 + 2k - 6 = 0 \\implies 2k - 10 = 0 \\implies k = 5$。"
    },
    {
      id: 7,
      question: "化簡對數表示式：$\\log_2(12) + \\log_2(6) - 2\\log_2(3)$ 的值。",
      options: ["2", "3", "4", "5"],
      answer: 1,
      explanation: "使用對數運算法則：$\\log_2(12) + \\log_2(6) - \\log_2(3^2) = \\log_2(12 \\times 6) - \\log_2(9) = \\log_2(\\frac{72}{9}) = \\log_2(8) = 3$。"
    },
    {
      id: 8,
      question: "已知一元指數方程式 $3^{2x+1} - 10 \\cdot 3^x + 3 = 0$，求 $x$ 的所有可能實數解之和。",
      options: ["-1", "0", "1", "2"],
      answer: 1,
      explanation: "令 $u = 3^x > 0$，方程式化為 $3u^2 - 10u + 3 = 0$。因式分解得 $(3u-1)(u-3) = 0$，得 $u = \\frac{1}{3}$ 或 $u = 3$。\n還原得 $3^x = 3^{-1}$ 或 $3^x = 3^1 \\implies x = -1, 1$，其所有可能解之和為 $-1 + 1 = 0$。"
    }
  ],
  "平面幾何": [
    {
      id: 1,
      question: "在直角三角形 $ABC$ 中，$\\angle C = 90^\\circ$。若兩直角邊 $AC = 6$，$BC = 8$，求斜邊 $AB$ 上的高 $h$。",
      options: ["4.8", "5.0", "5.2", "5.4"],
      answer: 0,
      explanation: "根據畢氏定理，斜邊 $AB = \\sqrt{6^2 + 8^2} = 10$。利用三角形面積公式，兩直角邊乘積之半等於斜邊乘以外接高之半：$\\frac{AC \\times BC}{2} = \\frac{AB \\times h}{2} \\implies 6 \\times 8 = 10h \\implies h = 4.8$。"
    },
    {
      id: 2,
      question: "一個正多邊形的內角和為 $1080^\\circ$，求此正多邊形的邊數 $n$。",
      options: ["6", "7", "8", "9"],
      answer: 2,
      explanation: "一個 $n$ 邊形的內角和公式為 $(n - 2) \\times 180^\\circ$。依題意得 $(n-2) \\times 180 = 1080 \\implies n - 2 = 6 \\implies n = 8$。故此為正八邊形。"
    },
    {
      id: 3,
      question: "已知圓 $O$ 的半徑為 $10$，弦 $AB$ 的長度為 $12$，求圓心 $O$ 到弦 $AB$ 的垂直距離。",
      options: ["5", "6", "8", "10"],
      answer: 2,
      explanation: "自圓心 $O$ 向弦 $AB$ 繪製垂線段，垂足為 $H$。依垂徑定理，弦被平分，即 $AH = \\frac{1}{2}AB = 6$。\n在直角三角形 $OAH$ 中，根據畢氏定理得圓心距 $OH = \\sqrt{OA^2 - AH^2} = \\sqrt{10^2 - 6^2} = 8$。"
    },
    {
      id: 4,
      question: "在 $\\triangle ABC$ 中，$D, E$ 分別在 $AB, AC$ 上且線段 $DE \\parallel BC$。已知 $AD = 3$，$DB = 6$，$DE = 4$，求底邊 $BC$ 的長度。",
      options: ["8", "10", "12", "15"],
      answer: 2,
      explanation: "因為 $DE \\parallel BC$，根據同位角相等，$\\triangle ADE \\sim \\triangle ABC$。\n得對應邊成比例：$\\frac{AD}{AB} = \\frac{DE}{BC}$。代入數值：$\\frac{3}{3+6} = \\frac{4}{BC} \\implies \\frac{1}{3} = \\frac{4}{BC} \\implies BC = 12$。"
    },
    {
      id: 5,
      question: "若一個圓的面積數值與其周長數值的比值為 $5$，求此圓的直徑長度。",
      options: ["10", "15", "20", "25"],
      answer: 2,
      explanation: "設圓半徑為 $r$，則面積為 $\\pi r^2$，周長為 $2\\pi r$。依題意：$\\frac{\\pi r^2}{2\\pi r} = 5 \\implies \\frac{r}{2} = 5 \\implies r = 10$。故直徑為 $2r = 20$。"
    },
    {
      id: 6,
      question: "直角座標平面上，圓方程式 $x^2 + y^2 - 4x + 6y - 3 = 0$ 的半徑為多少？",
      options: ["3", "4", "5", "6"],
      answer: 1,
      explanation: "將圓方程式配方成標準式：$(x^2 - 4x + 4) + (y^2 + 6y + 9) = 3 + 4 + 9 \\implies (x-2)^2 + (y+3)^2 = 16$。\n因此圓的半徑 $r = \\sqrt{16} = 4$。"
    },
    {
      id: 7,
      question: "一菱形 $ABCD$ 的周長為 $40$，其中一條對角線長度為 $12$，求此菱形的總面積。",
      options: ["48", "96", "120", "192"],
      answer: 1,
      explanation: "菱形的四邊等長，邊長 $s = \\frac{40}{4} = 10$。菱形對角線垂直且互相平分，半對角線長分別為 $6$ 與 $x$。根據畢氏定理：$x = \\sqrt{10^2 - 6^2} = 8$。故另一整條對角線長為 $16$。菱形面積為對角線乘積之半：$\\frac{12 \\times 16}{2} = 96$。"
    },
    {
      id: 8,
      question: "正三角形的內切圓面積與外接圓面積的比值是多少？",
      options: ["1:2", "1:3", "1:4", "2:3"],
      answer: 2,
      explanation: "對於邊長為 $a$ 的正三角形，其內切圓半徑 $r = \\frac{a}{2\\sqrt{3}}$，外接圓半徑 $R = \\frac{a}{\\sqrt{3}}$。半徑之比為 $\\frac{r}{R} = \\frac{1}{2}$。則面積比為半徑之平方比：$(\\frac{r}{R})^2 = \\frac{1}{4}$，即 $1:4$。"
    }
  ],
  "三角函數": [
    {
      id: 1,
      question: "已知 $\\theta$ 為銳角且 $\\sin \\theta = \\frac{3}{5}$，求 $\\tan \\theta$ 的值。",
      options: ["3/4", "4/3", "3/5", "4/5"],
      answer: 0,
      explanation: "因為 $\\theta$ 為銳角，根據畢氏恆等式得 $\\cos \\theta = \\sqrt{1 - \\sin^2 \\theta} = \\sqrt{1 - \\frac{9}{25}} = \\frac{4}{5}$。因此 $\\tan \\theta = \\frac{\\sin \\theta}{\\cos \\theta} = \\frac{3/5}{4/5} = \\frac{3}{4}$。"
    },
    {
      id: 2,
      question: "在 $\\triangle ABC$ 中，已知邊長 $a = 5$，$b = 8$，夾角 $\\angle C = 60^\\circ$，求對邊 $c$ 的長度。",
      options: ["6", "7", "8", "9"],
      answer: 1,
      explanation: "根據餘弦定理：$c^2 = a^2 + b^2 - 2ab \\cos C$。代入已知數據得：$c^2 = 25 + 64 - 2(5)(8)\\cos 60^\\circ = 89 - 80 \\times \\frac{1}{2} = 49 \\implies c = \\sqrt{49} = 7$。"
    },
    {
      id: 3,
      question: "化簡三角函數式：$\\sin^2(10^\\circ) + \\sin^2(80^\\circ) + \\tan(45^\\circ)$ 的值。",
      options: ["1", "2", "3", "4"],
      answer: 1,
      explanation: "根據餘角公式，$\\sin(80^\\circ) = \\cos(10^\\circ)$。代入原式得 $\\sin^2(10^\\circ) + \\cos^2(10^\\circ) + \\tan(45^\\circ)$。因 $\\sin^2 \\theta + \\cos^2 \\theta = 1$ 且 $\\tan(45^\\circ) = 1$，故原式結果為 $1 + 1 = 2$。"
    },
    {
      id: 4,
      question: "已知 $\\sin \\theta + \\cos \\theta = \\frac{7}{5}$，求兩者之乘積 $\\sin \\theta \\cos \\theta$ 的值。",
      options: ["12/25", "24/25", "7/10", "12/5"],
      answer: 0,
      explanation: "將已知關係式兩邊平方得：$(\\sin \\theta + \\cos \\theta)^2 = (\\frac{7}{5})^2 \\implies \\sin^2 \\theta + \\cos^2 \\theta + 2\\sin \\theta \\cos \\theta = \\frac{49}{25}$。由於平方關係式 $\\sin^2 \\theta + \\cos^2 \\theta = 1$，得 $1 + 2\\sin \\theta \\cos \\theta = \\frac{49}{25} \\implies 2\\sin \\theta \\cos \\theta = \\frac{24}{25} \\implies \\sin \\theta \\cos \\theta = \\frac{12}{25}$。"
    },
    {
      id: 5,
      question: "若 $\\tan \\theta = -3$ 且 $\\theta$ 落在第二象限，求 $\\sin \\theta$ 的精確值。",
      options: ["$3/\\sqrt{10}$", "$-3/\\sqrt{10}$", "$1/\\sqrt{10}$", "$-1/\\sqrt{10}$"],
      answer: 0,
      explanation: "設 $\\tan \\theta = \\frac{y}{x}$，在第二象限中 $x < 0, y > 0$。可設 $y = 3, x = -1$。斜邊長 $r = \\sqrt{x^2 + y^2} = \\sqrt{(-1)^2 + 3^2} = \\sqrt{10}$。故在第二象限中，$\\sin \\theta = \\frac{y}{r} = \\frac{3}{\\sqrt{10}}$。"
    },
    {
      id: 6,
      question: "已知二倍角公式 $\\sin(2\\theta) = \\frac{4}{5}$，且 $\\theta$ 為第一象限角，求 $\\sin \\theta + \\cos \\theta$ 的值。",
      options: ["$\\sqrt{9/5}$", "$\\sqrt{7/5}$", "$\\sqrt{6/5}$", "$\\sqrt{3}$"],
      answer: 0,
      explanation: "計算和的平方：$(\\sin \\theta + \\cos \\theta)^2 = \\sin^2 \\theta + \\cos^2 \\theta + 2\\sin \\theta \\cos \\theta = 1 + \\sin(2\\theta) = 1 + \\frac{4}{5} = \\frac{9}{5}$。因為 $\\theta$ 在第一象限，正弦與餘弦皆為正，故平方根取正：$\\sin \\theta + \\cos \\theta = \\sqrt{\\frac{9}{5}}$。"
    },
    {
      id: 7,
      question: "$\\triangle ABC$ 中，三邊長之比為 $a:b:c = 3:5:7$，求其最大內角 $\\angle C$ 的度數。",
      options: ["$90^\\circ$", "$120^\\circ$", "$135^\\circ$", "$150^\\circ$"],
      answer: 1,
      explanation: "設三邊分別為 $a=3k, b=5k, c=7k$。最大角對應最大邊 $c$。根據餘弦定理：$\\cos C = \\frac{a^2 + b^2 - c^2}{2ab} = \\frac{9k^2 + 25k^2 - 49k^2}{2(3k)(5k)} = \\frac{-15k^2}{30k^2} = -\\frac{1}{2}$。由 $\\cos C = -\\frac{1}{2}$，得最大內角 $C = 120^\\circ$。"
    },
    {
      id: 8,
      question: "求三角疊合函數 $y = 3\\sin(2x) - 4\\cos(2x) + 2$ 的最大可能實數值。",
      options: ["5", "6", "7", "8"],
      answer: 2,
      explanation: "利用疊合公式合成一單一正弦函數：$3\\sin(2x) - 4\\cos(2x) = 5\\sin(2x - \\phi)$，其振幅範圍為 $-5 \\le 5\\sin(2x - \\phi) \\le 5$。增加常數 $2$ 後，最大值為 $5 + 2 = 7$。"
    }
  ],
  "向量單元": [
    {
      id: 1,
      question: "二維直角座標平面上有向量 $\\vec{a} = (3, -4)$，求其長度（模長） $\\lVert \\vec{a} \\rVert$ 的值。",
      options: ["3", "4", "5", "10"],
      answer: 2,
      explanation: "二維向量 $\\vec{a} = (x, y)$ 的長度公式為 $\\lVert \\vec{a} \\rVert = \\sqrt{x^2 + y^2}$。代入計算得 $\\sqrt{3^2 + (-4)^2} = \\sqrt{9 + 16} = 5$。"
    },
    {
      id: 2,
      question: "已知兩平面向量 $\\vec{u} = (2, 3)$ 與 $\\vec{v} = (k, -4)$ 互相垂直，求 $k$ 的值。",
      options: ["4", "5", "6", "8"],
      answer: 2,
      explanation: "非零向量垂直的充要條件為其內積為 $0$。則有 $\\vec{u} \\cdot \\vec{v} = 0 \\implies (2)(k) + (3)(-4) = 0 \\implies 2k - 12 = 0 \\implies k = 6$。"
    },
    {
      id: 3,
      question: "已知兩向量 $\\vec{a} = (1, 2)$ 與 $\\vec{b} = (3, -1)$，求線性組合向量 $2\\vec{a} - \\vec{b}$ 的分量坐標。",
      options: ["(-1, 5)", "(-1, 3)", "(5, 3)", "(5, 5)"],
      answer: 0,
      explanation: "依向量的加減與純量乘法運算律：$2\\vec{a} - \\vec{b} = 2(1, 2) - (3, -1) = (2, 4) - (3, -1) = (2-3, 4-(-1)) = (-1, 5)$。"
    },
    {
      id: 4,
      question: "已知向量 $\\vec{a} = (1, \\sqrt{3})$ 與 $\\vec{b} = (\\sqrt{3}, 1)$，求這兩個向量的夾角 $\\theta$ 的大小。",
      options: ["$30^\\circ$", "$45^\\circ$", "$60^\\circ$", "$90^\\circ$"],
      answer: 0,
      explanation: "計算內積 $\\vec{a} \\cdot \\vec{b} = 1 \\times \\sqrt{3} + \\sqrt{3} \\times 1 = 2\\sqrt{3}$。\n求向量長度：$\\lVert\\vec{a}\\rVert = \\sqrt{1 + 3} = 2$，$\\lVert\\vec{b}\\rVert = \\sqrt{3 + 1} = 2$。\n由夾角餘弦：$\\cos \\theta = \\frac{\\vec{a} \\cdot \\vec{b}}{\\lVert\\vec{a}\\rVert \\lVert\\vec{b}\\rVert} = \\frac{2\\sqrt{3}}{2 \\times 2} = \\frac{\\sqrt{3}}{2}$，得 $\\theta = 30^\\circ$。"
    },
    {
      id: 5,
      question: "若向量 $\\vec{u} = (2, 1)$ 且 $\\vec{v} = (3, 4)$，求兩平面向量的內積值 $\\vec{u} \\cdot \\vec{v}$。",
      options: ["8", "10", "12", "14"],
      answer: 1,
      explanation: "平面向量內積的代數定義為：$\\vec{u} \\cdot \\vec{v} = x_1 x_2 + y_1 y_2$。代入對應分量計算：$2 \\times 3 + 1 \\times 4 = 6 + 4 = 10$。"
    },
    {
      id: 6,
      question: "在平行四邊形 $ABCD$ 中，邊射線向量分別為 $\\overrightarrow{AB} = (3, 2)$ 且 $\\overrightarrow{AD} = (1, 5)$，求對角線向量 $\\overrightarrow{BD}$。",
      options: ["(-2, 3)", "(2, -3)", "(4, 7)", "(-4, -7)"],
      answer: 0,
      explanation: "根據向量的三角形減法定理，從端點 $B$ 指向端點 $D$ 的對角線向量為：$\\overrightarrow{BD} = \\overrightarrow{AD} - \\overrightarrow{AB} = (1, 5) - (3, 2) = (1 - 3, 5 - 2) = (-2, 3)$。"
    },
    {
      id: 7,
      question: "設向量 $\\vec{a} = (x, 3)$ 且 $\\vec{b} = (2, -1)$，若 $\\vec{a} \\parallel \\vec{b}$，求變數 $x$ 的值。",
      options: ["-6", "-3", "3", "6"],
      answer: 0,
      explanation: "兩平面向量平行的條件是它們的分量成比例：$\\frac{x}{2} = \\frac{3}{-1} \\implies -x = 6 \\implies x = -6$。"
    },
    {
      id: 8,
      question: "已知兩向量的長度分別為 $\\lVert \\vec{u} \\rVert = 3$，$\\lVert \\vec{v} \\rVert = 4$，且夾角為 $120^\\circ$，求組合向量 $\\lVert 2\\vec{u} + \\vec{v} \\rVert$ 的長度值。",
      options: ["$2\\sqrt{3}$", "$2\\sqrt{5}$", "$2\\sqrt{7}$", "$4$"],
      answer: 2,
      explanation: "將所求模長平方展開：$\\lVert 2\\vec{u} + \\vec{v} \\rVert^2 = 4\\lVert\\vec{u}\\rVert^2 + \\lVert\\vec{v}\\rVert^2 + 4(\\vec{u} \\cdot \\vec{v})$。\n計算內積：$\\vec{u} \\cdot \\vec{v} = \\lVert\\vec{u}\\rVert \\lVert\\vec{v}\\rVert \\cos 120^\\circ = 3 \\times 4 \\times (-\\frac{1}{2}) = -6$。\n代入上式：$4(9) + 16 + 4(-6) = 36 + 16 - 24 = 28$。\n因此長度為 $\\sqrt{28} = 2\\sqrt{7}$。"
    }
  ],
  "微積分初步": [
    {
      id: 1,
      question: "求多項式函數 $f(x) = 3x^2 - 5x + 2$ 在點 $x = 2$ 處的一階導數值 $f'(2)$。",
      options: ["5", "6", "7", "8"],
      answer: 2,
      explanation: "對函數 $f(x)$ 應用求導公式得微分函數：$f'(x) = 6x - 5$。將 $x = 2$ 代入導函數計算：$f'(2) = 6(2) - 5 = 7$。"
    },
    {
      id: 2,
      question: "計算單元定積分：$\\int_{1}^{3} (2x + 1) \\, dx$ 的值。",
      options: ["8", "9", "10", "11"],
      answer: 2,
      explanation: "首先求出被積函數的反導函數 $F(x) = x^2 + x$。根據微積分基本定理，定積分值為 $F(3) - F(1) = (3^2 + 3) - (1^2 + 1) = 12 - 2 = 10$。"
    },
    {
      id: 3,
      question: "求極限極值問題的解：$\\lim_{x \\to 3} \\frac{x^2 - 9}{x - 3}$ 的極限值。",
      options: ["0", "3", "6", "不存在"],
      answer: 2,
      explanation: "因直接代入得定式 $\\frac{0}{0}$ 型，可先對分子分解因式：$\\frac{(x-3)(x+3)}{x-3}$。當 $x \\neq 3$ 時消去共因子 $(x-3)$，得 $x + 3$。接著求導極限 $\\lim_{x \\to 3} (x + 3) = 6$。"
    },
    {
      id: 4,
      question: "設函數 $f(x) = e^{2x} + \\cos x$，求它的微分函數在 $x = 0$ 處的導數值 $f'(0)$。",
      options: ["1", "2", "3", "4"],
      answer: 1,
      explanation: "應用導數公式及鏈鎖律對函數求導：$f'(x) = 2e^{2x} - \\sin x$。將 $x = 0$ 代入導函數：$f'(0) = 2e^0 - \\sin 0 = 2(1) - 0 = 2$。"
    },
    {
      id: 5,
      question: "試確定三次曲線函數 $y = x^3 - 3x$ 的相對極小值。",
      options: ["-2", "-1", "1", "2"],
      answer: 0,
      explanation: "求一階導數：$y' = 3x^2 - 3 = 3(x-1)(x+1) = 0 \\implies x = 1$ 或 $x = -1$。再求二階導數：$y'' = 6x$。由於 $y''(1) = 6 > 0$，故曲線在 $x = 1$ 處有相對極小值，其極小值為 $y(1) = 1^3 - 3(1) = -2$。"
    },
    {
      id: 6,
      question: "試求解定積分：$\\int_{0}^{2} 3x^2 \\, dx$ 的計算結果。",
      options: ["4", "6", "8", "12"],
      answer: 2,
      explanation: "被積函數的反導函數為 $F(x) = x^3$。根據微積分基本定理，定積分結果為 $F(2) - F(0) = 2^3 - 0^3 = 8$。"
    },
    {
      id: 7,
      question: "求極限表示式結果：$\\lim_{h \\to 0} \\frac{\\sqrt{4+h} - 2}{h}$。",
      options: ["1/4", "1/2", "1", "不存在"],
      answer: 0,
      explanation: "有理化分子：分子和分母同乘以 $\\sqrt{4+h} + 2$。原式化簡為 $\\lim_{h \\to 0} \\frac{(4+h) - 4}{h(\\sqrt{4+h} + 2)} = \\lim_{h \\to 0} \\frac{h}{h(\\sqrt{4+h} + 2)} = \\lim_{h \\to 0} \\frac{1}{\\sqrt{4+h} + 2} = \\frac{1}{4}$。"
    },
    {
      id: 8,
      question: "已知物體的直線運動位置函數 $s(t) = 2t^3 - t^2$（以秒計），求物體在時間 $t = 2$ 秒時的瞬間加速度（位置的二階導數）。",
      options: ["18", "20", "22", "24"],
      answer: 2,
      explanation: "一階導數為速度 $v(t) = s'(t) = 6t^2 - 2t$。二階導數為加速度 $a(t) = s''(t) = 12t - 2$。將 $t = 2$ 代入得加速度為 $12(2) - 2 = 22$，即每秒平方 22 單位長度。"
    }
  ],
  "統計與機率": [
    {
      id: 1,
      question: "一個不透明袋中有 3 個紅球和 5 個黑球。一次自袋中取出一球不放回，連續抽取兩次。求兩次都抽取到紅球的概率。",
      options: ["3/28", "9/64", "3/8", "6/56"],
      answer: 0,
      explanation: "第一次抽取到紅球的概率為 $\\frac{3}{8}$。在不放回的條件下，袋中餘下 2 紅 5 黑，第二次亦得紅球的條件機率為 $\\frac{2}{7}$。故兩次皆抽取到紅球之概率為 $\\frac{3}{8} \\times \\frac{2}{7} = \\frac{6}{56} = \\frac{3}{28}$。"
    },
    {
      id: 2,
      question: "一組由 5 個數組成的樣本數據為 $2, 4, 4, 8, 12$，求這組數據的樣本標準差 $s$。",
      options: ["3", "4", "5", "6"],
      answer: 1,
      explanation: "1. 樣本平均數 $\\bar{x} = \\frac{2+4+4+8+12}{5} = 6$。\n2. 各偏差的平方和為 $(2-6)^2 + (4-6)^2 + (4-6)^2 + (8-6)^2 + (12-6)^2 = 16 + 4 + 4 + 4 + 36 = 64$。\n3. 樣本變異數 $s^2 = \\frac{64}{5-1} = 16$，故樣本標準差 $s = \\sqrt{16} = 4$。"
    },
    {
      id: 3,
      question: "同時投擲兩顆公正的六面骰子一次，求兩顆骰子點數之和恰好為 $8$ 的機率。",
      options: ["5/36", "1/6", "7/36", "1/12"],
      answer: 0,
      explanation: "投擲兩顆骰子的樣本空間總事件數為 $6 \\times 6 = 36$。點數和為 $8$ 的事件包含 $(2,6), (3,5), (4,4), (5,3), (6,2)$，共計 5 種情況。故其機率為 $\\frac{5}{36}$。"
    },
    {
      id: 4,
      question: "已知事件 $A$ 與 $B$ 為相互獨立事件若 $P(A) = 0.4$ 且 $P(B) = 0.5$，求它們的聯集機率 $P(A \\cup B)$。",
      options: ["0.7", "0.8", "0.9", "0.2"],
      answer: 0,
      explanation: "由於 $A$ 與 $B$ 相互獨立，交集機率為 $P(A \\cap B) = P(A) \\times P(B) = 0.4 \\times 0.5 = 0.2$。根據機率加法定理，聯集機率 $P(A \\cup B) = P(A) + P(B) - P(A \\cap B) = 0.4 + 0.5 - 0.2 = 0.7$。"
    },
    {
      id: 5,
      question: "某班計有 40 位學生，期末數學考考分的平均值為 70 分，標準差為 5 分。若授課老師決定將每人的原始分數皆調成「乘上 1.25 倍再加上 5 分」，求調整後的新考分平均數為多少？",
      options: ["87.5", "90.5", "92.5", "93"],
      answer: 2,
      explanation: "當數據經由線性變換 $Y = aX + b$ 調整時，新平均值符合相同的變換規律。代入數值計算：$\\mu_Y = 1.25 \\times \\mu_X + 5 = 1.25 \\times 70 + 5 = 87.5 + 5 = 92.5$ 分。"
    },
    {
      id: 6,
      question: "某個袋子中有大小完全相同的 5 個紅球、3 個黃球及 2 個綠球。由袋中隨機一次取出 3 個球，求這 3 球全部均為紅球的機率值。",
      options: ["1/12", "1/6", "5/12", "1/4"],
      answer: 0,
      explanation: "總共有 10 個球。從 10 求抽 3 球之樣本空間總事件為 $C^{10}_{3} = \\frac{10 \\times 9 \\times 8}{3 \\times 2 \\times 1} = 120$ 種。\n取出的 3 球均為紅球的情況數為 $C^5_3 = 10$ 種。\n因此機率為 $\\frac{10}{120} = \\frac{1}{12}$。"
    },
    {
      id: 7,
      question: "已知一項試驗每次成功的機率為 $0.4$，現獨立重複進行此試驗 3 次。求 3 次中至少成功取得 1 次的機率。",
      options: ["0.64", "0.784", "0.856", "0.936"],
      answer: 1,
      explanation: "利用餘事件的對立關係求解：至少成功 1 次的相反對立情況為「3 次皆失敗」。\n每次失敗的概率為 $1 - 0.4 = 0.6$，3 次皆失敗的機率為 $(0.6)^3 = 0.216$。\n因此至少成功 1 次的機率為 $1 - 0.216 = 0.784$。"
    },
    {
      id: 8,
      question: "統計檢驗敏感度為 $0.9$，特異度為 $0.8$。在罹病盛行率為 $0.1$ 的人口環境中，若某居民篩檢結果為陽性，求此人真正罹病的機率（貝氏預測值）。",
      options: ["1/4", "1/3", "2/5", "1/2"],
      answer: 1,
      explanation: "設 $D$ 為罹病，$H$ 為健康。已知 $P(D)=0.1, P(H)=0.9$。\n1. 篩檢為陽性的總機率為：$P(+) = P(+|D)P(D) + P(+|H)P(H) = 0.9 \\times 0.1 + (1 - 0.8) \\times 0.9 = 0.09 + 0.18 = 0.27$。\n2. 篩檢陽性中真正罹病之機率為：$P(D|+) = \\frac{P(+|D)P(D)}{P(+)} = \\frac{0.09}{0.27} = \\frac{1}{3}$。"
    }
  ],
  "邏輯推理": [
    {
      id: 1,
      question: "若 $P \\implies Q$ 為真，且 $\\neg Q$ 亦為真，則下列何者必然為真？",
      options: ["$P$", "$\\neg P$", "$Q$", "$P \\lor Q$"],
      answer: 1,
      explanation: "依逆否命題原理，$P \\implies Q$ 等價於 $\\neg Q \\implies \\neg P$。若 $\\neg Q$ 成立，則 $\\neg P$ 亦真。"
    },
    {
      id: 2,
      question: "一個袋子裡有紅球 5 個、藍球 6 個。一次至少要取出多少個球，才能保證一定能拿到至少一個藍球？",
      options: ["2 個", "5 個", "6 個", "7 個"],
      answer: 2,
      explanation: "最壞狀況前 5 個都是紅球，第 6 個必定為藍球，故至少須取 6 個球。"
    },
    {
      id: 3,
      question: "某班有 40 名學生，其中 25 人喜歡數學，18 人喜歡英文，10 人兩科都喜歡。兩科都不喜歡的有多少人？",
      options: ["3 人", "7 人", "10 人", "15 人"],
      answer: 1,
      explanation: "喜歡至少一科人數為 $25 + 18 - 10 = 33$。因此都不喜歡的人數為 $40 - 33 = 7$ 人。"
    },
    {
      id: 4,
      question: "一隻蝸牛自 10 公尺深井往上爬。白天爬 3 公尺，晚上滑 2 公尺。問幾天能爬出井口？",
      options: ["7 天", "8 天", "9 天", "10 天"],
      answer: 1,
      explanation: "前 7 天淨升 7 米，第 8 天白天直接爬過最後 3 米達頂端，不再下滑，共 8 天。"
    },
    {
      id: 5,
      question: "5 個座位排一列，甲、乙兩人不相鄰的坐法共有多少種？",
      options: ["36", "48", "72", "120"],
      answer: 2,
      explanation: "全部坐法 $5! = 120$。減去相鄰坐法：捆綁甲乙共 $4! \\times 2! = 48$ 種。得出 $120-48=72$。"
    },
    {
      id: 6,
      question: "四人單循環羽球賽（每兩人恰比一場）。目前甲賽 3 場，乙賽 2 場，丙賽 1 場。問丁赛了幾場？",
      options: ["1 場", "2 場", "3 場", "4 場"],
      answer: 1,
      explanation: "甲賽3場（對乙丙丁）。丙只1場（對甲）。乙賽2場（對甲丁）。丁則賽了2場（對甲乙）。"
    },
    {
      id: 7,
      question: "12 位教授坐圓桌。選 3人，要求任兩選出者在圓桌上皆不相鄰，問有幾種選法？",
      options: ["112", "120", "144", "220"],
      answer: 0,
      explanation: "圓桌不相鄰公式：$\\frac{n}{n-k} C^{n-k}_k$。代入 $n=12, k=3$ 得 $\\frac{12}{9} C^9_3 = 112$。"
    },
    {
      id: 8,
      question: "10 個人互相握手，每個人握手次數各異。請問以下哪一項敘述在邏輯上是不可能的？",
      options: ["每個人握手次數全不相同", "恰有兩個人握數相同", "全員握手次數和為偶數", "其中某人一把手都沒握"],
      answer: 0,
      explanation: "握手次數 0 次與 9 次不互容，實得 9 種握數，分配 10 人依鳩籠原理必有兩個人握數相同。"
    }
  ]
};
