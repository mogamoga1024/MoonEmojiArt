(function() {
    module("3.月変換 細い縦線考慮");

    test("🌑", function() {
        const pixels = [
            [B, B, B, B],
            [B, B, B, B],
            [B, B, B, B],
            [B, B, B, B],
        ];
        strictEqual(TukiArtGenerator._convertTuki(pixels, false, true), "🌑");
    });
    test("🌒", function() {
        const pixels = [
            [B, B, B, W],
            [B, B, B, W],
            [B, B, B, W],
            [B, B, B, W],
        ];
        strictEqual(TukiArtGenerator._convertTuki(pixels, false, true), "🌒");
    });
    test("🌓", function() {
        const pixels = [
            [B, B, W, W],
            [B, B, W, W],
            [B, B, W, W],
            [B, B, W, W],
        ];
        strictEqual(TukiArtGenerator._convertTuki(pixels, false, true), "🌓");
    });
    test("🌔", function() {
        const pixels = [
            [B, W, W, W],
            [B, W, W, W],
            [B, W, W, W],
            [B, W, W, W],
        ];
        strictEqual(TukiArtGenerator._convertTuki(pixels, false, true), "🌔");
    });
    test("🌘", function() {
        const pixels = [
            [W, B, B, B],
            [W, B, B, B],
            [W, B, B, B],
            [W, B, B, B],
        ];
        strictEqual(TukiArtGenerator._convertTuki(pixels, false, true), "🌘");
    });
    test("🌗", function() {
        const pixels = [
            [W, W, B, B],
            [W, W, B, B],
            [W, W, B, B],
            [W, W, B, B],
        ];
        strictEqual(TukiArtGenerator._convertTuki(pixels, false, true), "🌗");
    });
    test("🌖", function() {
        const pixels = [
            [W, W, W, B],
            [W, W, W, B],
            [W, W, W, B],
            [W, W, W, B],
        ];
        strictEqual(TukiArtGenerator._convertTuki(pixels, false, true), "🌖");
    });
    test("🌕", function() {
        const pixels = [
            [W, W, W, W],
            [W, W, W, W],
            [W, W, W, W],
            [W, W, W, W],
        ];
        strictEqual(TukiArtGenerator._convertTuki(pixels, false, true), "🌕");
    });
    test("🌑 > 🌘", function() {
        const pixels = [
            [W, B, B, B],
            [W, B, B, B],
            [B, B, B, B],
            [B, B, B, B],
        ];
        strictEqual(TukiArtGenerator._convertTuki(pixels, false, true), "🌑");
    });
    test("🌕 > 🌔", function() {
        const pixels = [
            [B, W, W, W],
            [B, W, W, W],
            [W, W, W, W],
            [W, W, W, W],
        ];
        strictEqual(TukiArtGenerator._convertTuki(pixels, false, true), "🌕");
    });
    test("🌗 > 🌘🌖", function() {
        const pixels = [
            [W, W, B, B],
            [W, W, B, B],
            [W, B, W, B],
            [W, B, W, B],
        ];
        strictEqual(TukiArtGenerator._convertTuki(pixels, false, true), "🌗");
    });
    test("🌓 > 🌒🌔", function() {
        const pixels = [
            [B, B, W, W],
            [B, B, W, W],
            [B, W, B, W],
            [B, W, B, W],
        ];
        strictEqual(TukiArtGenerator._convertTuki(pixels, false, true), "🌓");
    });
    test("🌑 > 🌕🌒🌓🌔🌘🌗🌖", function() {
        const pixels = [
            [W, W, B, B],
            [W, W, B, B],
            [B, B, W, W],
            [B, B, W, W],
        ];
        strictEqual(TukiArtGenerator._convertTuki(pixels, false, true), "🌑");
    });
    test("縦線 8 🌑 > 🌕", function() {
        const pixels = [
            [W, B, B, W],
            [W, B, B, W],
            [W, B, B, W],
            [W, B, B, W],
        ];
        strictEqual(TukiArtGenerator._convertTuki(pixels, false, true), "🌑");
    });
    test("縦線 7 🌑 > 🌕", function() {
        const pixels = [
            [W, B, B, W],
            [W, W, B, W],
            [W, B, B, W],
            [W, B, B, W],
        ];
        strictEqual(TukiArtGenerator._convertTuki(pixels, false, true), "🌑");
    });
    test("縦線 7 🌑 > 🌕", function() {
        const pixels = [
            [W, B, W, W],
            [W, B, B, W],
            [W, B, B, W],
            [W, B, B, W],
        ];
        strictEqual(TukiArtGenerator._convertTuki(pixels, false, true), "🌑");
    });
    test("縦線 6 🌑 > 🌕", function() {
        const pixels = [
            [W, B, B, W],
            [W, W, B, W],
            [W, B, B, W],
            [W, B, W, W],
        ];
        strictEqual(TukiArtGenerator._convertTuki(pixels, false, true), "🌑");
    });
    test("縦線 6 🌑 > 🌕", function() {
        const pixels = [
            [W, B, B, W],
            [W, B, B, W],
            [W, B, B, W],
            [W, W, W, W],
        ];
        strictEqual(TukiArtGenerator._convertTuki(pixels, false, true), "🌑");
    });
    test("縦線 6 🌓 > 🌕", function() {
        const pixels = [
            [W, B, W, W],
            [W, B, B, W],
            [W, B, B, W],
            [W, B, W, W],
        ];
        strictEqual(TukiArtGenerator._convertTuki(pixels, false, true), "🌓");
    });
    test("縦線 6 🌗 > 🌕", function() {
        const pixels = [
            [W, B, B, W],
            [W, W, B, W],
            [W, W, B, W],
            [W, B, B, W],
        ];
        strictEqual(TukiArtGenerator._convertTuki(pixels, false, true), "🌗");
    });
    test("縦線 6 🌓 > 🌕", function() {
        const pixels = [
            [W, B, W, B],
            [W, B, W, W],
            [W, B, W, W],
            [W, B, W, B],
        ];
        strictEqual(TukiArtGenerator._convertTuki(pixels, false, true), "🌓");
    });
    test("縦線 6 🌗 > 🌕", function() {
        const pixels = [
            [W, W, B, W],
            [B, W, B, W],
            [B, W, B, W],
            [W, W, B, W],
        ];
        strictEqual(TukiArtGenerator._convertTuki(pixels, false, true), "🌗");
    });    
    test("縦線 6 🌓 > 🌕", function() {
        const pixels = [
            [B, B, W, W],
            [B, W, W, W],
            [B, B, W, W],
            [B, W, W, W],
        ];
        strictEqual(TukiArtGenerator._convertTuki(pixels, false, true), "🌓");
    });
    test("縦線 6 🌗 > 🌕", function() {
        const pixels = [
            [W, W, W, B],
            [W, W, B, B],
            [W, W, B, B],
            [W, W, W, B],
        ];
        strictEqual(TukiArtGenerator._convertTuki(pixels, false, true), "🌗");
    });
    test("縦線 6 🌔 > 🌕", function() {
        const pixels = [
            [B, W, W, B],
            [B, W, W, W],
            [B, W, W, W],
            [B, W, W, B],
        ];
        strictEqual(TukiArtGenerator._convertTuki(pixels, false, true), "🌔");
    });
    test("縦線 6 🌖 > 🌕", function() {
        const pixels = [
            [W, W, W, B],
            [B, W, W, B],
            [B, W, W, B],
            [W, W, W, B],
        ];
        strictEqual(TukiArtGenerator._convertTuki(pixels, false, true), "🌖");
    });
    test("縦線 4 🌕", function() {
        const pixels = [
            [W, W, W, W],
            [W, B, B, W],
            [W, B, B, W],
            [W, W, W, W],
        ];
        strictEqual(TukiArtGenerator._convertTuki(pixels, false, true), "🌕");
    });
    test("縦線 黒要素が少なすぎるのは駄目 🌕 > 🌔", function() {
        const pixels = [
            [B, W, W, W],
            [B, W, W, W],
            [W, W, W, W],
            [W, W, W, W],
        ];
        strictEqual(TukiArtGenerator._convertTuki(pixels, false, true), "🌕");
    });
})();