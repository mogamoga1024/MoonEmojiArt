(function() {
    const tukiArtGenerator = new TukiArtGenerator();

    module("月変換");

    test("🌑", function() {
        const pixels = [
            [B, B, B, B],
            [B, B, B, B],
            [B, B, B, B],
            [B, B, B, B],
        ];
        strictEqual(tukiArtGenerator._convertTuki(pixels), "🌑");
    });
    test("🌒", function() {
        const pixels = [
            [B, B, B, W],
            [B, B, B, W],
            [B, B, B, W],
            [B, B, B, W],
        ];
        strictEqual(tukiArtGenerator._convertTuki(pixels), "🌒");
    });
    test("🌓", function() {
        const pixels = [
            [B, B, W, W],
            [B, B, W, W],
            [B, B, W, W],
            [B, B, W, W],
        ];
        strictEqual(tukiArtGenerator._convertTuki(pixels), "🌓");
    });
    test("🌔", function() {
        const pixels = [
            [B, W, W, W],
            [B, W, W, W],
            [B, W, W, W],
            [B, W, W, W],
        ];
        strictEqual(tukiArtGenerator._convertTuki(pixels), "🌔");
    });
    test("🌘", function() {
        const pixels = [
            [W, B, B, B],
            [W, B, B, B],
            [W, B, B, B],
            [W, B, B, B],
        ];
        strictEqual(tukiArtGenerator._convertTuki(pixels), "🌘");
    });
    test("🌗", function() {
        const pixels = [
            [W, W, B, B],
            [W, W, B, B],
            [W, W, B, B],
            [W, W, B, B],
        ];
        strictEqual(tukiArtGenerator._convertTuki(pixels), "🌗");
    });
    test("🌖", function() {
        const pixels = [
            [W, W, W, B],
            [W, W, W, B],
            [W, W, W, B],
            [W, W, W, B],
        ];
        strictEqual(tukiArtGenerator._convertTuki(pixels), "🌖");
    });
    test("🌕", function() {
        const pixels = [
            [W, W, W, W],
            [W, W, W, W],
            [W, W, W, W],
            [W, W, W, W],
        ];
        strictEqual(tukiArtGenerator._convertTuki(pixels), "🌕");
    });
    test("🌑 > 🌘", function() {
        const pixels = [
            [W, B, B, B],
            [W, B, B, B],
            [B, B, B, B],
            [B, B, B, B],
        ];
        strictEqual(tukiArtGenerator._convertTuki(pixels), "🌑");
    });
    test("🌕 > 🌔", function() {
        const pixels = [
            [B, W, W, W],
            [B, W, W, W],
            [W, W, W, W],
            [W, W, W, W],
        ];
        strictEqual(tukiArtGenerator._convertTuki(pixels), "🌕");
    });
    test("🌗 > 🌘🌖", function() {
        const pixels = [
            [W, W, B, B],
            [W, W, B, B],
            [W, B, W, B],
            [W, B, W, B],
        ];
        strictEqual(tukiArtGenerator._convertTuki(pixels), "🌗");
    });
    test("🌓 > 🌒🌔", function() {
        const pixels = [
            [B, B, W, W],
            [B, B, W, W],
            [B, W, B, W],
            [B, W, B, W],
        ];
        strictEqual(tukiArtGenerator._convertTuki(pixels), "🌓");
    });
    test("🌕 > 🌑🌒🌓🌔🌘🌗🌖", function() {
        const pixels = [
            [W, W, B, B],
            [W, W, B, B],
            [B, B, W, W],
            [B, B, W, W],
        ];
        strictEqual(tukiArtGenerator._convertTuki(pixels), "🌕");
    });
})();