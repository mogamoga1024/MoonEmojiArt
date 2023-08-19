# MoonEmojiArt
月文字ジェネレータ（JS版）  

[https://mogamoga1024.github.io/MoonEmojiArt/](https://mogamoga1024.github.io/MoonEmojiArt/)

デバグ用  
[https://mogamoga1024.github.io/MoonEmojiArt/?isDebug=true](https://mogamoga1024.github.io/MoonEmojiArt/?isDebug=true)

スマホからだとゴシック体の高さが違う～～～～～あああああああああああああ！！！

https://stackoverflow.com/questions/46653569/canvas-measuretext-differences-on-browsers-are-huge

テキストの絵文字が反映されないのは黒の要素がないためです。  
やろうと思えば反映できますが必要性を感じないので対応しません。

縦書きでは「っゃゅょぁぃぅぇぉッャュョァィゥェォ」「、。」の座標を強引に変えています。  
バグるかもしれません。

縦書きで  
「」【】ー ～  
といった文字を90度回転させたいですが未対応です。
