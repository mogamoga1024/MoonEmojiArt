(function() {
    const tukiArtGenerator = new TukiArtGenerator();

    module("月変換 細い横線考慮");

    test("🌑", function() {
        const pixels = [
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
        ];
        strictEqual(tukiArtGenerator._convertTuki(pixels, true), "🌑");
    });
    test("🌒", function() {
        const pixels = [
            [0, 0, 0, 1],
            [0, 0, 0, 1],
            [0, 0, 0, 1],
            [0, 0, 0, 1],
        ];
        strictEqual(tukiArtGenerator._convertTuki(pixels, true), "🌒");
    });
    test("🌓", function() {
        const pixels = [
            [0, 0, 1, 1],
            [0, 0, 1, 1],
            [0, 0, 1, 1],
            [0, 0, 1, 1],
        ];
        strictEqual(tukiArtGenerator._convertTuki(pixels, true), "🌓");
    });
    test("🌔", function() {
        const pixels = [
            [0, 1, 1, 1],
            [0, 1, 1, 1],
            [0, 1, 1, 1],
            [0, 1, 1, 1],
        ];
        strictEqual(tukiArtGenerator._convertTuki(pixels, true), "🌔");
    });
    test("🌘", function() {
        const pixels = [
            [1, 0, 0, 0],
            [1, 0, 0, 0],
            [1, 0, 0, 0],
            [1, 0, 0, 0],
        ];
        strictEqual(tukiArtGenerator._convertTuki(pixels, true), "🌘");
    });
    test("🌗", function() {
        const pixels = [
            [1, 1, 0, 0],
            [1, 1, 0, 0],
            [1, 1, 0, 0],
            [1, 1, 0, 0],
        ];
        strictEqual(tukiArtGenerator._convertTuki(pixels, true), "🌗");
    });
    test("🌖", function() {
        const pixels = [
            [1, 1, 1, 0],
            [1, 1, 1, 0],
            [1, 1, 1, 0],
            [1, 1, 1, 0],
        ];
        strictEqual(tukiArtGenerator._convertTuki(pixels, true), "🌖");
    });
    test("🌕", function() {
        const pixels = [
            [1, 1, 1, 1],
            [1, 1, 1, 1],
            [1, 1, 1, 1],
            [1, 1, 1, 1],
        ];
        strictEqual(tukiArtGenerator._convertTuki(pixels, true), "🌕");
    });
    test("🌑 > 🌘", function() {
        const pixels = [
            [1, 0, 0, 0],
            [1, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
        ];
        strictEqual(tukiArtGenerator._convertTuki(pixels, true), "🌑");
    });
    test("🌕 > 🌔", function() {
        const pixels = [
            [0, 1, 1, 1],
            [0, 1, 1, 1],
            [1, 1, 1, 1],
            [1, 1, 1, 1],
        ];
        strictEqual(tukiArtGenerator._convertTuki(pixels, true), "🌕");
    });
    test("🌗 > 🌘🌖", function() {
        const pixels = [
            [1, 1, 0, 0],
            [1, 1, 0, 0],
            [1, 0, 1, 0],
            [1, 0, 1, 0],
        ];
        strictEqual(tukiArtGenerator._convertTuki(pixels, true), "🌗");
    });
    test("🌓 > 🌒🌔", function() {
        const pixels = [
            [0, 0, 1, 1],
            [0, 0, 1, 1],
            [0, 1, 0, 1],
            [0, 1, 0, 1],
        ];
        strictEqual(tukiArtGenerator._convertTuki(pixels, true), "🌓");
    });
    test("🌕 > 🌑🌒🌓🌔🌘🌗🌖", function() {
        const pixels = [
            [1, 1, 0, 0],
            [1, 1, 0, 0],
            [0, 0, 1, 1],
            [0, 0, 1, 1],
        ];
        strictEqual(tukiArtGenerator._convertTuki(pixels, true), "🌕");
    });
    test("横線 4 🌕 > 🌑", function() {
        const pixels = [
            [1, 1, 1, 1],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
        ];
        strictEqual(tukiArtGenerator._convertTuki(pixels, true), "🌕");
    });
    test("横線 4 🌕 > 🌑", function() {
        const pixels = [
            [0, 0, 0, 0],
            [1, 1, 1, 1],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
        ];
        strictEqual(tukiArtGenerator._convertTuki(pixels, true), "🌕");
    });
    test("横線 4 🌕 > 🌑", function() {
        const pixels = [
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [1, 1, 1, 1],
        ];
        strictEqual(tukiArtGenerator._convertTuki(pixels, true), "🌕");
    });
    test("横線 4 🌕 > 🌑", function() {
        const pixels = [
            [0, 0, 0, 1],
            [0, 0, 1, 0],
            [0, 1, 0, 0],
            [1, 0, 0, 0],
        ];
        strictEqual(tukiArtGenerator._convertTuki(pixels, true), "🌕");
    });
    test("横線 3 🌕 > 🌑", function() {
        const pixels = [
            [1, 0, 1, 1],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
        ];
        strictEqual(tukiArtGenerator._convertTuki(pixels, true), "🌕");
    });
    test("横線 3 🌕 > 🌑", function() {
        const pixels = [
            [0, 0, 0, 0],
            [1, 1, 0, 1],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
        ];
        strictEqual(tukiArtGenerator._convertTuki(pixels, true), "🌕");
    });
    test("横線 3 🌕 > 🌑", function() {
        const pixels = [
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [1, 1, 1, 0],
        ];
        strictEqual(tukiArtGenerator._convertTuki(pixels, true), "🌕");
    });
    test("横線 3 🌕 > 🌑", function() {
        const pixels = [
            [0, 0, 0, 1],
            [0, 0, 1, 0],
            [0, 1, 0, 0],
            [0, 0, 0, 0],
        ];
        strictEqual(tukiArtGenerator._convertTuki(pixels, true), "🌕");
    });
    test("横線 2 🌑", function() {
        const pixels = [
            [1, 1, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
        ];
        strictEqual(tukiArtGenerator._convertTuki(pixels, true), "🌑");
    });
    test("横線 2 🌑", function() {
        const pixels = [
            [0, 0, 0, 0],
            [0, 0, 1, 0],
            [0, 1, 0, 0],
            [0, 0, 0, 0],
        ];
        strictEqual(tukiArtGenerator._convertTuki(pixels, true), "🌑");
    });
})();