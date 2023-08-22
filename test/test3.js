(function() {
    const tukiArtGenerator = new TukiArtGenerator();

    module("月変換 細い縦線考慮");

    test("🌑", function() {
        const pixels = [
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
        ];
        strictEqual(tukiArtGenerator._convertTuki(pixels, false, true), "🌑");
    });
    test("🌒", function() {
        const pixels = [
            [0, 0, 0, 1],
            [0, 0, 0, 1],
            [0, 0, 0, 1],
            [0, 0, 0, 1],
        ];
        strictEqual(tukiArtGenerator._convertTuki(pixels, false, true), "🌒");
    });
    test("🌓", function() {
        const pixels = [
            [0, 0, 1, 1],
            [0, 0, 1, 1],
            [0, 0, 1, 1],
            [0, 0, 1, 1],
        ];
        strictEqual(tukiArtGenerator._convertTuki(pixels, false, true), "🌓");
    });
    test("🌔", function() {
        const pixels = [
            [0, 1, 1, 1],
            [0, 1, 1, 1],
            [0, 1, 1, 1],
            [0, 1, 1, 1],
        ];
        strictEqual(tukiArtGenerator._convertTuki(pixels, false, true), "🌔");
    });
    test("🌘", function() {
        const pixels = [
            [1, 0, 0, 0],
            [1, 0, 0, 0],
            [1, 0, 0, 0],
            [1, 0, 0, 0],
        ];
        strictEqual(tukiArtGenerator._convertTuki(pixels, false, true), "🌘");
    });
    test("🌗", function() {
        const pixels = [
            [1, 1, 0, 0],
            [1, 1, 0, 0],
            [1, 1, 0, 0],
            [1, 1, 0, 0],
        ];
        strictEqual(tukiArtGenerator._convertTuki(pixels, false, true), "🌗");
    });
    test("🌖", function() {
        const pixels = [
            [1, 1, 1, 0],
            [1, 1, 1, 0],
            [1, 1, 1, 0],
            [1, 1, 1, 0],
        ];
        strictEqual(tukiArtGenerator._convertTuki(pixels, false, true), "🌖");
    });
    test("🌕", function() {
        const pixels = [
            [1, 1, 1, 1],
            [1, 1, 1, 1],
            [1, 1, 1, 1],
            [1, 1, 1, 1],
        ];
        strictEqual(tukiArtGenerator._convertTuki(pixels, false, true), "🌕");
    });
    test("🌑 > 🌘", function() {
        const pixels = [
            [1, 0, 0, 0],
            [1, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
        ];
        strictEqual(tukiArtGenerator._convertTuki(pixels, false, true), "🌑");
    });
    test("🌕 > 🌔", function() {
        const pixels = [
            [0, 1, 1, 1],
            [0, 1, 1, 1],
            [1, 1, 1, 1],
            [1, 1, 1, 1],
        ];
        strictEqual(tukiArtGenerator._convertTuki(pixels, false, true), "🌕");
    });
    test("🌗 > 🌘🌖", function() {
        const pixels = [
            [1, 1, 0, 0],
            [1, 1, 0, 0],
            [1, 0, 1, 0],
            [1, 0, 1, 0],
        ];
        strictEqual(tukiArtGenerator._convertTuki(pixels, false, true), "🌗");
    });
    test("🌓 > 🌒🌔", function() {
        const pixels = [
            [0, 0, 1, 1],
            [0, 0, 1, 1],
            [0, 1, 0, 1],
            [0, 1, 0, 1],
        ];
        strictEqual(tukiArtGenerator._convertTuki(pixels, false, true), "🌓");
    });
    test("🌑 > 🌕🌒🌓🌔🌘🌗🌖", function() {
        const pixels = [
            [1, 1, 0, 0],
            [1, 1, 0, 0],
            [0, 0, 1, 1],
            [0, 0, 1, 1],
        ];
        strictEqual(tukiArtGenerator._convertTuki(pixels, false, true), "🌑");
    });

    // todo

    
})();