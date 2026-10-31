// Lista de membros exibida em membros.html.
// Para adicionar alguém, copie uma linha da seção certa e troque os dados.
// "discord" é o nome de usuário mostrado embaixo do nome.
// O fundador fica direto no HTML de membros.html.
const communityData = {
    "conselho": [
        { "name": "Gusttxxx", "discord": "scrr_1_1_", "img": "assets/gusttxxx.jpg", "region": "Rio de Janeiro", "flag": "assets/rj2.png", "origin": "Lords", "origin_img": "assets/lords.jpg", "game": "Elden Ring", "cover": "assets/elden.jpg" },
        { "name": "Putridkhan31", "discord": "putridkhan31", "img": "assets/putridkhan31.jpg", "region": "Manaus", "flag": "assets/manaus.png", "origin": "Lords", "origin_img": "assets/lords.jpg", "game": "Silent Hill 2", "cover": "assets/sh2.jpg" },
        { "name": "JUAN", "discord": "JUAN", "img": "assets/juan.jpg", "region": "Manaus", "flag": "assets/manaus.png", "origin": "Lords", "origin_img": "assets/lords.jpg", "game": "Hollow Knight", "cover": "assets/hollow.jpg" },
        { "name": "OLIVEIRA", "discord": "__762__", "img": "assets/oliveira.jpg", "region": "Rio de Janeiro", "flag": "assets/rj2.png", "origin": "Lords", "origin_img": "assets/lords.jpg", "game": "Red Dead Redemption 2", "cover": "assets/rdr2.jpg" }
    ],
    "geral": [
        { "name": "Deepest", "discord": "m.7274", "img": "assets/m.jpg", "origin": "Ui ui", "origin_img": "assets/uiui.jpg" },
        { "name": "manopombo", "discord": "mano_pombo", "img": "assets/manopombo.jpg", "origin": "Lords", "origin_img": "assets/lords.jpg" },
        { "name": "bielcachu", "discord": "bielcachu", "img": "assets/bielcachu.jpg", "origin": "Cavalos Do Criacionismo", "origin_img": "assets/cavalos.jpg" },
        { "name": "akimbo", "discord": "taldoakimbo", "img": "assets/akimbo.jpg", "origin": "Cavalos Do Criacionismo", "origin_img": "assets/cavalos.jpg" },
        { "name": "Pedroflash", "discord": "fudido007", "img": "assets/pedroflash.jpg", "origin": "𝕲𝖑𝖚𝖙𝖎𝖓𝖔𝖘𝖔𝖘 𝖊 𝕬𝖘𝖘𝖔𝖈𝖎𝖆𝖉𝖔𝖘", "origin_img": "assets/minions.jpg" },
        { "name": "Macarrão Instantâneo", "discord": "macarrao_instantaneo", "img": "assets/arthur.jpg", "origin": "𝕲𝖑𝖚𝖙𝖎𝖓𝖔𝖘𝖔𝖘 𝖊 𝕬𝖘𝖘𝖔𝖈𝖎𝖆𝖉𝖔𝖘", "origin_img": "assets/minions.jpg" },
        { "name": "TheFriendlyFabs", "discord": "thefriendlyfabs", "img": "assets/thefriendlyfabs.jpg", "origin": "𝕲𝖑𝖚𝖙𝖎𝖓𝖔𝖘𝖔𝖘 𝖊 𝕬𝖘𝖘𝖔𝖈𝖎𝖆𝖉𝖔𝖘", "origin_img": "assets/minions.jpg" },
        { "name": "gokucalvo", "discord": "gokucalvodoplay2", "img": "assets/vitor.jpg", "origin": "𝕲𝖑𝖚𝖙𝖎𝖓𝖔𝖘𝖔𝖘 𝖊 𝕬𝖘𝖘𝖔𝖈𝖎𝖆𝖉𝖔𝖘", "origin_img": "assets/minions.jpg" },
        { "name": "ZERØ", "discord": "darkzin2256", "img": "assets/zero.jpg", "origin": "Cavalos Do Criacionismo", "origin_img": "assets/cavalos.jpg" },
        { "name": "Bryan Cruz", "discord": "Bryan Cruz", "img": "assets/bryan-cruz.jpg", "origin": "Meliantes", "origin_img": "assets/meliantes.jpg" },
        { "name": "rafaelweb", "discord": "rafaelweb86.", "img": "assets/rafaelweb.jpg", "origin": "Cavalos Do Criacionismo", "origin_img": "assets/cavalos.jpg" },
        { "name": "nephente", "discord": "nephente_br", "img": "assets/nephente.jpg", "origin": "𝕲𝖑𝖚𝖙𝖎𝖓𝖔𝖘𝖔𝖘 𝖊 𝕬𝖘𝖘𝖔𝖈𝖎𝖆𝖉𝖔𝖘", "origin_img": "assets/minions.jpg" },
        { "name": "gica", "discord": "ellosgio", "img": "assets/gica.jpg", "origin": "Meliantes", "origin_img": "assets/meliantes.jpg" },
        { "name": "Gigas", "discord": "gigasbrothers", "img": "assets/gigas.jpg", "origin": "Meliantes", "origin_img": "assets/meliantes.jpg" },
        { "name": "robozinbiruta", "discord": "robozinbiruta", "img": "assets/robozinbiruta.jpg", "origin": "Meliantes", "origin_img": "assets/meliantes.jpg" },
        { "name": "evenen", "discord": "theevenen", "img": "assets/evenen.jpg", "origin": "Meliantes", "origin_img": "assets/meliantes.jpg" },
        { "name": "mar", "discord": "bloom7p_", "img": "assets/mar.jpg", "origin": "Meliantes", "origin_img": "assets/meliantes.jpg" },
        { "name": "nickzin", "discord": "nickzindo69", "img": "assets/nickzin.jpg", "origin": "Meliantes", "origin_img": "assets/meliantes.jpg" },
        { "name": "drezin", "discord": "drezin8094", "img": "assets/drezin.jpg", "origin": "Meliantes", "origin_img": "assets/meliantes.jpg" },
        { "name": "luahari", "discord": "luahari", "img": "assets/luahari.jpg", "origin": "Meliantes", "origin_img": "assets/meliantes.jpg" },
        { "name": "xarutinn", "discord": "xarutinn0756", "img": "assets/xarutinn.jpg", "origin": "Meliantes", "origin_img": "assets/meliantes.jpg" },
        { "name": "manu.zzx", "discord": "manu.zzx", "img": "assets/manu.jpg", "origin": "Meliantes", "origin_img": "assets/meliantes.jpg" },
        { "name": "morcega", "discord": "mmorcega", "img": "assets/morcega.jpg", "origin": "Meliantes", "origin_img": "assets/meliantes.jpg" },
        { "name": "SCOTT", "discord": "rdpreguica", "img": "assets/scott.jpg", "origin": "Meliantes", "origin_img": "assets/meliantes.jpg" }
    ],
    "banidos": [
        { "name": "kaktusz", "discord": "kaktusz", "img": "assets/kaktusz.jpg", "origin": "Lords", "origin_img": "assets/lords.jpg" }
    ]
};
