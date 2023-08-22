(function() {
    const tukiArtGenerator = new TukiArtGenerator();

    module("月変換 細い横線考慮");

    test("🌑", function() {
        const pixels = [
            [B, B, B, B],
            [B, B, B, B],
            [B, B, B, B],
            [B, B, B, B],
        ];
        strictEqual(tukiArtGenerator._convertTuki(pixels, true), "🌑");
    });
    test("🌒", function() {
        const pixels = [
            [B, B, B, W],
            [B, B, B, W],
            [B, B, B, W],
            [B, B, B, W],
        ];
        strictEqual(tukiArtGenerator._convertTuki(pixels, true), "🌒");
    });
    test("🌓", function() {
        const pixels = [
            [B, B, W, W],
            [B, B, W, W],
            [B, B, W, W],
            [B, B, W, W],
        ];
        strictEqual(tukiArtGenerator._convertTuki(pixels, true), "🌓");
    });
    test("🌔", function() {
        const pixels = [
            [B, W, W, W],
            [B, W, W, W],
            [B, W, W, W],
            [B, W, W, W],
        ];
        strictEqual(tukiArtGenerator._convertTuki(pixels, true), "🌔");
    });
    test("🌘", function() {
        const pixels = [
            [W, B, B, B],
            [W, B, B, B],
            [W, B, B, B],
            [W, B, B, B],
        ];
        strictEqual(tukiArtGenerator._convertTuki(pixels, true), "🌘");
    });
    test("🌗", function() {
        const pixels = [
            [W, W, B, B],
            [W, W, B, B],
            [W, W, B, B],
            [W, W, B, B],
        ];
        strictEqual(tukiArtGenerator._convertTuki(pixels, true), "🌗");
    });
    test("🌖", function() {
        const pixels = [
            [W, W, W, B],
            [W, W, W, B],
            [W, W, W, B],
            [W, W, W, B],
        ];
        strictEqual(tukiArtGenerator._convertTuki(pixels, true), "🌖");
    });
    test("🌕", function() {
        const pixels = [
            [W, W, W, W],
            [W, W, W, W],
            [W, W, W, W],
            [W, W, W, W],
        ];
        strictEqual(tukiArtGenerator._convertTuki(pixels, true), "🌕");
    });
    test("🌑 > 🌘", function() {
        const pixels = [
            [W, B, B, B],
            [W, B, B, B],
            [B, B, B, B],
            [B, B, B, B],
        ];
        strictEqual(tukiArtGenerator._convertTuki(pixels, true), "🌑");
    });
    test("🌕 > 🌔", function() {
        const pixels = [
            [B, W, W, W],
            [B, W, W, W],
            [W, W, W, W],
            [W, W, W, W],
        ];
        strictEqual(tukiArtGenerator._convertTuki(pixels, true), "🌕");
    });
    test("🌗 > 🌘🌖", function() {
        const pixels = [
            [W, W, B, B],
            [W, W, B, B],
            [W, B, W, B],
            [W, B, W, B],
        ];
        strictEqual(tukiArtGenerator._convertTuki(pixels, true), "🌗");
    });
    test("🌓 > 🌒🌔", function() {
        const pixels = [
            [B, B, W, W],
            [B, B, W, W],
            [B, W, B, W],
            [B, W, B, W],
        ];
        strictEqual(tukiArtGenerator._convertTuki(pixels, true), "🌓");
    });
    test("🌑 > 🌕🌒🌓🌔🌘🌗🌖", function() {
        const pixels = [
            [W, W, B, B],
            [W, W, B, B],
            [B, B, W, W],
            [B, B, W, W],
        ];
        strictEqual(tukiArtGenerator._convertTuki(pixels, true), "🌑");
    });
    test("横線 5 🌑 > 🌕", function() {
        const pixels = [
            [W, W, W, W],
            [B, B, B, B],
            [W, B, W, W],
            [W, W, W, W],
        ];
        strictEqual(tukiArtGenerator._convertTuki(pixels, true), "🌑");
    });
    test("横線 4 🌑 > 🌕", function() {
        const pixels = [
            [B, B, B, B],
            [W, W, W, W],
            [W, W, W, W],
            [W, W, W, W],
        ];
        strictEqual(tukiArtGenerator._convertTuki(pixels, true), "🌑");
    });
    test("横線 4 🌑 > 🌕", function() {
        const pixels = [
            [W, W, W, W],
            [B, B, B, B],
            [W, W, W, W],
            [W, W, W, W],
        ];
        strictEqual(tukiArtGenerator._convertTuki(pixels, true), "🌑");
    });
    test("横線 4 🌑 > 🌕", function() {
        const pixels = [
            [W, W, W, W],
            [W, W, W, W],
            [W, W, W, W],
            [B, B, B, B],
        ];
        strictEqual(tukiArtGenerator._convertTuki(pixels, true), "🌑");
    });
    test("横線 4 🌑 > 🌕", function() {
        const pixels = [
            [W, W, W, B],
            [W, W, B, W],
            [W, B, W, W],
            [B, W, W, W],
        ];
        strictEqual(tukiArtGenerator._convertTuki(pixels, true), "🌑");
    });
    test("横線 3 🌑 > 🌕", function() {
        const pixels = [
            [B, W, B, B],
            [W, W, W, W],
            [W, W, W, W],
            [W, W, W, W],
        ];
        strictEqual(tukiArtGenerator._convertTuki(pixels, true), "🌑");
    });
    test("横線 3 🌑 > 🌕", function() {
        const pixels = [
            [W, W, W, W],
            [B, B, W, B],
            [W, W, W, W],
            [W, W, W, W],
        ];
        strictEqual(tukiArtGenerator._convertTuki(pixels, true), "🌑");
    });
    test("横線 3 🌑 > 🌕", function() {
        const pixels = [
            [W, W, W, W],
            [W, W, W, W],
            [W, W, W, W],
            [B, B, B, W],
        ];
        strictEqual(tukiArtGenerator._convertTuki(pixels, true), "🌑");
    });
    test("横線 3 🌑 > 🌕", function() {
        const pixels = [
            [W, W, W, B],
            [W, W, B, W],
            [W, B, W, W],
            [W, W, W, W],
        ];
        strictEqual(tukiArtGenerator._convertTuki(pixels, true), "🌑");
    });
    test("横線 2 🌕", function() {
        const pixels = [
            [B, B, W, W],
            [W, W, W, W],
            [W, W, W, W],
            [W, W, W, W],
        ];
        strictEqual(tukiArtGenerator._convertTuki(pixels, true), "🌕");
    });
    test("横線 2 🌕", function() {
        const pixels = [
            [W, W, W, W],
            [W, W, B, W],
            [W, B, W, W],
            [W, W, W, W],
        ];
        strictEqual(tukiArtGenerator._convertTuki(pixels, true), "🌕");
    });
    test("縦は駄目 🌔", function() {
        const pixels = [
            [B, W, W, W],
            [B, W, W, W],
            [B, W, W, W],
            [B, W, W, W],
        ];
        strictEqual(tukiArtGenerator._convertTuki(pixels, true), "🌔");
    });
    test("縦は駄目 🌗", function() {
        const pixels = [
            [W, W, B, B],
            [W, W, B, B],
            [W, W, W, B],
            [W, W, B, B],
        ];
        strictEqual(tukiArtGenerator._convertTuki(pixels, true), "🌗");
    });
})();