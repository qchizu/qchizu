let latlng = "";
let z = "";
let arcX = "";
let arcY = "";
let pascoZl = "";
let kkcZl = "";
let extent1 = "";
let extent2 = "";
let extent3 = "";
let extent4 = "";

const prefhp ={
    "1":{"1":{"html":"土砂警","title":"北海道土砂災害警戒情報システム","url":"https://www.njwa.jp/hokkaido-sabou/others/displayDesignatedMap.do?area=0"},
    "2":{"html":"森林","title":"ほっかいどう森まっぷ","url":"https://www2.wagmap.jp/hokkaido_forest/Map?&mid=1&mtp=pfm&gprj=3"+ "&mpx=" + latlng.lng + "&mpy=" + latlng.lat + "&mps=" + pascoZl[z]},
    "3":{"html":"国有林","title":"国有林・道有林 銃猟立入禁止区域図","url":"https://hokkaido.maps.arcgis.com/apps/webappviewer/index.html?id=ce0ad3cc7c9e41a6ad13ef490502901b"+ "&center=" + arcX + "%2C" + arcY + "%2C102100&level=" + z},
    },
    "2":{"1":{"html":"土砂警","title":"土砂災害警戒区域等マップ","url":"https://www.sabomap.jp/00common/map.php?PREF_KBN=aomori"+ "&extent=" +  extent1 + "," + extent2 + "," + extent3 + "," + extent4},
    
    
    },
    "3":{"1":{"html":"統合型(土砂警)","title":"いわてデジタルマップ(砂防GISコンテンツ)","url":"https://www.sonicweb-asp.jp/iwate/map#layers=HYBRID%2Cth_68&theme=th_68"+ "#scale=" + kkcZl + "&pos="+ latlng.lng + "%2C" + latlng.lat},
    
    
    },
    "4":{"1":{"html":"土砂警","title":"宮城県土砂災害警戒区域等確認マップ","url":"https://www.dobokugis2.pref.miyagi.jp/webgis/?z=" + z + "&ll=" + latlng.lat + "%2C" + latlng.lng + "&t=gsitile&mp=4&op=70&vlf=4-20220715115915-01ffff"},
    "2":{"html":"森林","title":"宮城県森林情報提供システム","url":"http://fgis-pref-miyagi.jp/map.php?lon=" + latlng.lng + "&lat=" + latlng.lat},
    
    },
    "5":{"1":{"html":"土砂警","title":"秋田県土砂災害危険箇所マップ","url":"http://sabomap.pref.akita.lg.jp/"},
    "2":{"html":"森林","title":"秋田県森林情報公開サービス","url":"https://akitafmd-akitafmd.hub.arcgis.com/"},
    
    },
    "6":{
    
    
    },
    "7":{
    
    
    },
    "8":{
    
    
    },
    "9":{
    
    
    },
    "10":{
    
    
    },
    "11":{
    
    
    },
    "12":{
    
    
    },
    "13":{
    
    
    },
    "14":{
    
    
    },
    "15":{
    
    
    },
    "16":{
    
    
    },
    "17":{
    
    
    },
    "18":{
    
    
    },
    "19":{
    
    
    },
    "20":{
    
    
    },
    "21":{
    
    
    },
    "22":{
    
    
    },
    "23":{
    
    
    },
    "24":{
    
    
    },
    "25":{
    
    
    },
    "26":{
    
    
    },
    "27":{
    
    
    },
    "28":{
    
    
    },
    "29":{
    
    
    },
    "30":{
    
    
    },
    "31":{
    
    
    },
    "32":{
    
    
    },
    "33":{
    
    
    },
    "34":{
    
    
    },
    "35":{
    
    
    },
    "36":{"1":{"html":"土砂警","title":"徳島県水防・砂防情報マップ","url":"https://www.sabo.pref.tokushima.lg.jp/map/MapForm.aspx?mtype=map03&z=" + z + "&x=" + latlng.lng + "&y=" + latlng.lat},
    
    
    },
    "37":{"1":{"html":"土砂警","title":"かがわ防災Webポータル","url":"https://www.bousai-kagawa.jp/P_PUB_VF_kakudaiMap?lk=122,123&lat=" + latlng.lat + "&lng=" + latlng.lng + "&zoom=" + z},
    
    
    },
    "38":{"1":{"html":"土砂警","title":"えひめ土砂災害情報マップ","url":"https://www.sabomap.pref.ehime.jp/MapForm.aspx?z=" + z + "&x=" + latlng.lng + "&y=" + latlng.lat},
    
    
    },
    "39":{"1":{"html":"地盤","title":"こうち地盤情報公開サイト #柱状図","url":"https://publicweb.ngic.or.jp/etc/kochi/webgis/"},
    "2":{"html":"防災","title":"高知県防災マップ","url":"https://bousaimap.pref.kochi.lg.jp/kochi/gate/?dtp=" + z + "&mpx=" + latlng.lat + "&mpy=" + latlng.lng + "&gprj=2&mps=20000&mtp=3&msz=0&mtl=1311%2C1312%2C15&mcl=264%2C265%2C711%2C266%2C267%2C712%2C286%2C287%2C288"},
    
    },
    "40":{"1":{"html":"土砂警","title":"土砂災害警戒区域等マップ","url":"https://www2.sabomap.jp/00common/map.php?PREF_KBN=fukuoka"+ "&extent=" +  extent1 + "," + extent2 + "," + extent3 + "," + extent4},
    "2":{"html":"森林","title":"ふくおか森林オープンデータ #小字","url":"https://www.arcgis.com/apps/webappviewer/index.html?id=49d2cf9c5fa74321ac40857fa6e5f0bb&center=" + arcX + "%2C" + arcY + "%2C102100&level=" + z},
    
    },
    "41":{"1":{"html":"土砂警","title":"安図くん","url":"https://anzu.pref.saga.lg.jp/gau_Andy/public/hazard/"},
    
    
    },
    "42":{"1":{"html":"防災","title":"長崎県総合防災GIS #土砂警","url":"https://www.pref.nagasaki.jp/sb/gis/index.php#"},
    
    
    },
    "43":{"1":{"html":"土砂警","title":"土砂災害情報マップ","url":"http://sabo.kiken.pref.kumamoto.jp/website/sabo/kuiki"},
    
    
    },
    "44":{"1":{"html":"土砂警","title":"大分県土砂災害警戒区域等情報（インターネット提供システム）","url":"https://sabo-oita.jp/dosya_map/index_map.html"},
    "2":{"html":"環境","title":"大分県環境地理情報システム","url":"https://oita-kankyougis.jp/eims_oita/Home/Map#" + z + "/" + latlng.lat + "/" + latlng.lng},
    
    },
    "45":{"1":{"html":"統合型(写真)","title":"ひなたGIS #情報豊富","url":"https://hgis.pref.miyazaki.lg.jp/hinata/hinata.html#"+ z + "/" + latlng.lat + "/" + latlng.lng + "&l=%5B%5B%7B%22n%22:%22pale%22,%22o%22:1,%22z%22:150%7D,%7B%22n%22:%22miyazakiort%22,%22o%22:1,%22z%22:152%7D%5D,%5B%7B%22n%22:%22pale%22,%22o%22:1,%22z%22:151%7D%5D%5D"},
    "2":{"html":"土砂警","title":"土砂災害警戒区域等マップ","url":"https://www.sabomap.jp/00common/map.php?PREF_KBN=miyazaki&extent=" +  extent1 + "," + extent2 + "," + extent3 + "," + extent4},
    "3":{"html":"森林","title":"宮崎県森林地理情報公開システム","url":"http://shinrin-gis.pref.miyazaki.lg.jp/forest-gis/map/"},
    },
    "46":{"1":{"html":"土砂警","title":"土砂災害警戒区域等マップ","url":"https://sabomap.pref.kagoshima.jp/00common/map.php?PREF_KBN=kagoshima&extent=" +  extent1 + "," + extent2 + "," + extent3 + "," + extent4},
    
    
    },
    "47":{"1":{"html":"統合型(土砂警)","title":"沖縄県地図情報システム #地形図、写真","url":"https://gis.pref.okinawa.jp/pref-okinawa/Map?mid=13&mpx=" + latlng.lng + "&mpy=" + latlng.lat + "&mps=" + pascoZl[z] + "&mtp=kiban&gprj=3"},
    
    
    },
     
  };
  
  const cityhp ={
    "40100":{"1":{"html":"G-motty","title":"G-motty 行政情報","url":"https://gmottygyosei-kitakyushu.opendata.arcgis.com/"},
    "2":{"html":"路線網","title":"道路路線網図・幅員マップ #拡大で平面図","url":"https://kitakyushu.maps.arcgis.com/apps/webappviewer/index.html?id=241cf73dbe0247c0bf75c525546089c1"+ "&center=" + arcX + "%2C" + arcY + "%2C102100&level=" + z},
    "3":{"html":"下水道","title":"北九州市公共下水道施設平面図","url":"https://kitakyushu.maps.arcgis.com/apps/webappviewer/index.html?id=884686b7793e49d8878cc55688c1c77e"+ "&center=" + arcX + "%2C" + arcY + "%2C102100&level=" + z},
    "4":{"html":"基準点","title":"基準点配点図","url":"https://kitakyushu.maps.arcgis.com/apps/webappviewer/index.html?id=94189c7f6b5a4da1aa68ea5f309c92bd"+ "&center=" + arcX + "%2C" + arcY + "%2C102100&level=" + z},},
    "40130":{"1":{"html":"統合型(都計)","title":"福岡市Webまっぷ(都市計画情報マップ)","url":"https://webmap.city.fukuoka.lg.jp/fukuoka/Map?mid=7&gprj=3&mtp=dm"+ "&mpx=" + latlng.lng + "&mpy=" + latlng.lat + "&mps=" + pascoZl[z]},
    "2":{"html":"(地番)","title":"福岡市Webまっぷ(字図(地番参考図))","url":"https://webmap.city.fukuoka.lg.jp/fukuoka/Map?mid=66&mtp=wh&gprj=3"+ "&mpx=" + latlng.lng + "&mpy=" + latlng.lat + "&mps=" + pascoZl[z]},
    "3":{"html":"(基準点)","title":"福岡市Webまっぷ(土木・基準点) #柱状図・基準点","url":"https://webmap.city.fukuoka.lg.jp/fukuoka/Map?mid=64&mtp=dm&gprj=3"+ "&mpx=" + latlng.lng + "&mpy=" + latlng.lat + "&mps=" + pascoZl[z]},
    "4":{"html":"下水道","title":"福岡市道路下水道局 下水道台帳閲覧ページ","url":"http://gesui.city.fukuoka.lg.jp/system/?lon="+ latlng.lng + "&lat=" + latlng.lat + "&z=" + z + "&r=0"},},
    "40202":{"1":{"html":"統合型(都計)","title":"おおむた地図ナビ(都市計画情報マップ)","url":"https://www2.wagmap.jp/omuta/Map?mid=2&mtp=dm&gprj=3"+ "&mpx=" + latlng.lng + "&mpy=" + latlng.lat + "&mps=" + pascoZl[z]},
    "2":{"html":"(基準点・路線網)","title":"おおむた地図ナビ(道路・交通情報マップ)","url":"https://www2.wagmap.jp/omuta/Map?mid=4&mtp=dm&gprj=3"+ "&mpx=" + latlng.lng + "&mpy=" + latlng.lat + "&mps=" + pascoZl[z]},
    
    },
    "40203":{"1":{"html":"路線網","title":"久留米市市道路線網図","url":"https://kurume-koukai.maps.arcgis.com/apps/webappviewer/index.html?id=bb469f8bcc4e465ca98adc41416e17b0"+ "&center=" + arcX + "%2C" + arcY + "%2C102100&level=" + z},
    
    
    },
    "40204":{"1":{"html":"G-motty","title":"G-motty 行政情報","url":"https://gmottygyosei-kitakyushu.opendata.arcgis.com/"},
    "2":{"html":"路線網","title":"道路路線網図・幅員マップ #拡大で平面図","url":"https://kitakyushu.maps.arcgis.com/apps/webappviewer/index.html?id=241cf73dbe0247c0bf75c525546089c1"+ "&center=" + arcX + "%2C" + arcY + "%2C102100&level=" + z},
    "3":{"html":"下水道","title":"直方市下水道等施設平面図","url":"https://kitakyushu.maps.arcgis.com/apps/webappviewer/index.html?id=33b5bf8d91414f369731009d01a25b03"+ "&center=" + arcX + "%2C" + arcY + "%2C102100&level=" + z},
    },
    "40205":{"1":{"html":"都計","title":"飯塚市都市計画マップ","url":"https://www.google.com/maps/d/u/0/viewer?mid=19kliK_TlX8GMpO30KO20pmelue0KSzA"+ "&ll=" + latlng.lat + "%2C" + latlng.lng + "&z=" + z},
    
    
    },
    "40206":{
    
    
    },
    "40207":{
    
    
    },
    "40210":{
    
    
    },
    "40211":{
    
    
    },
    "40212":{
    
    
    },
    "40213":{"1":{"html":"G-motty","title":"G-motty 行政情報","url":"https://gmottygyosei-kitakyushu.opendata.arcgis.com/"},
    
    
    },
    "40214":{
    
    
    },
    "40215":{"1":{"html":"統合型(地形図)","title":"中間市行政情報マップ(地形図)","url":"https://www2.wagmap.jp/nakama/Map?mid=8&mtp=dm&gprj=3&mcl=-1,-1,-1,-1"+ "&mpx=" + latlng.lng + "&mpy=" + latlng.lat + "&mps=" + pascoZl[z]},
    "2":{"html":"(都計)","title":"中間市行政情報マップ(都市計画マップ)","url":"https://www2.wagmap.jp/nakama/Map?mid=6&mtp=dm&gprj=3"+ "&mpx=" + latlng.lng + "&mpy=" + latlng.lat + "&mps=" + pascoZl[z]},
    "3":{"html":"(路線網)","title":"中間市行政情報マップ(道路情報マップ)","url":"https://www2.wagmap.jp/nakama/Map?mid=7&mtp=dm&gprj=3"+ "&mpx=" + latlng.lng + "&mpy=" + latlng.lat + "&mps=" + pascoZl[z]},
    "4":{"html":"(下水道)","title":"中間市行政情報マップ(下水道マップ)","url":"https://www2.wagmap.jp/nakama/Map?mid=9&mtp=dm&gprj=3"+ "&mpx=" + latlng.lng + "&mpy=" + latlng.lat + "&mps=" + pascoZl[z]},},
    "40216":{
    
    
    },
    "40217":{
    
    
    },
    "40218":{"1":{"html":"統合型(地形図)","title":"春日市地理情報システム(地形図)","url":"https://webgis.alandis.jp/kasuga40/webgis/index.php/autologin_jswebgis?u=guest&ap=jsWebGIS&m=2&ca=jsWebGIS&rs=3857&li=3"+ "&x=" + wmlatlng.x + "&y=" + wmlatlng.y + "&s=" + ajikoZl},
    "2":{"html":"(写真)","title":"春日市地理情報システム(航空写真)","url":"https://webgis.alandis.jp/kasuga40/webgis/index.php/autologin_jswebgis?u=guest&ap=jsWebGIS&m=2&ca=jsWebGIS&rs=3857&li=4"},
    "3":{"html":"(都計)","title":"春日市地理情報システム(都市計画図)","url":"https://webgis.alandis.jp/kasuga40/webgis/index.php/autologin_jswebgis?u=guest&ap=jsWebGIS&m=2&ca=jsWebGIS&rs=3857&li=1"},
    "4":{"html":"(道路台帳)","title":"春日市地理情報システム(道路台帳図)","url":"https://webgis.alandis.jp/kasuga40/webgis/index.php/autologin_jswebgis?u=guest&ap=jsWebGIS&m=2&ca=jsWebGIS&rs=3857&li=2"},},
    "40219":{"1":{"html":"統合型(都計)","title":"大野城まどかマップ(都市計画情報)","url":"https://www2.wagmap.jp/onojo/Map?mid=2&mtp=dm&gprj=3"+ "&mpx=" + latlng.lng + "&mpy=" + latlng.lat + "&mps=" + pascoZl[z]},
    "2":{"html":"(道路台帳)","title":"大野城まどかマップ(道路台帳図)","url":"https://www2.wagmap.jp/onojo/Map?mid=3&mtp=doro&gprj=3"+ "&mpx=" + latlng.lng + "&mpy=" + latlng.lat + "&mps=" + pascoZl[z]},
    "3":{"html":"(下水道)","title":"大野城まどかマップ(下水道台帳)","url":"https://www2.wagmap.jp/onojo/Map?mid=4&mtp=dm&gprj=3"+ "&mpx=" + latlng.lng + "&mpy=" + latlng.lat + "&mps=" + pascoZl[z]},
    "4":{"html":"(住居表示)","title":"大野城まどかマップ(住居表示台帳)","url":"https://www2.wagmap.jp/onojo/Map?mid=6&mtp=dm&gprj=3"+ "&mpx=" + latlng.lng + "&mpy=" + latlng.lat + "&mps=" + pascoZl[z]},},
    "40220":{"1":{"html":"統合型(地形図)","title":"都市計画情報(地形図)","url":"https://www.sonicweb-asp.jp/munakata/map?theme=th_27"+ "#scale=" + kkcZl + "&pos="+ latlng.lng + "%2C" + latlng.lat},
    "2":{"html":"(写真)","title":"都市計画情報(航空写真)","url":"https://www.sonicweb-asp.jp/munakata/map?theme=th_27&layers=ortho,th_27"+ "#scale=" + kkcZl + "&pos="+ latlng.lng + "%2C" + latlng.lat},
    "3":{"html":"(都計)","title":"都市計画情報","url":"https://www.sonicweb-asp.jp/munakata/map?"+ "#scale=" + kkcZl + "&pos="+ latlng.lng + "%2C" + latlng.lat},
    },
    "40221":{"1":{"html":"統合型(都計)","title":"都市計画情報マップ","url":"https://dazaifu.maps.arcgis.com/apps/webappviewer/index.html?id=87d48387210e4576981c432ba6e09f9d"+ "&center=" + arcX + "%2C" + arcY + "%2C102100&level=" + z},
    "2":{"html":"(道路台帳)","title":"道路台帳図マップ","url":"https://dazaifu.maps.arcgis.com/apps/webappviewer/index.html?id=9457a348df214ea8858d6fb3a56c6e3d"+ "&center=" + arcX + "%2C" + arcY + "%2C102100&level=" + z},
    
    },
    "40223":{
    
    
    },
    "40224":{"1":{"html":"統合型(地形図)","title":"福津市地図サービス(共用空間)","url":"https://www.sonicweb-asp.jp/fukutsu2/map?theme=default&layers=kyoyo"+ "#scale=" + kkcZl + "&pos="+ latlng.lng + "%2C" + latlng.lat},
    "2":{"html":"(都計図)","title":"福津市地図サービス(都市計画)","url":"https://www.sonicweb-asp.jp/fukutsu2/map?layers=kyoyo"+ "#scale=" + kkcZl + "&pos="+ latlng.lng + "%2C" + latlng.lat},
    "3":{"html":"(路線網)","title":"福津市地図サービス(路線網図)","url":"https://www.sonicweb-asp.jp/fukutsu2/map?theme=th_16"+ "#scale=" + kkcZl + "&pos="+ latlng.lng + "%2C" + latlng.lat},
    "4":{"html":"(下水道)","title":"福津市地図サービス(下水道) #標高","url":"https://www.sonicweb-asp.jp/fukutsu2/map?theme=th_20"+ "#scale=" + kkcZl + "&pos="+ latlng.lng + "%2C" + latlng.lat},},
    "40225":{
    
    
    },
    "40226":{"1":{"html":"道路台帳","title":"宮若市道路台帳図","url":"https://www.city.miyawaka.lg.jp/dourodaichou/"},
    
    
    },
    "40227":{
    
    
    },
    "40228":{
    
    
    },
    "40229":{
    
    
    },
    "40230":{"1":{"html":"統合型(都計)","title":"糸島市Webマップ(都市計画情報マップ)","url":"https://www2.wagmap.jp/itoshima/Map?mid=12&mtp=dm&gprj=3"+ "&mpx=" + latlng.lng + "&mpy=" + latlng.lat + "&mps=" + pascoZl[z]},
    "2":{"html":"(道路網)","title":"糸島市Webマップ(道路情報マップ)","url":"https://www2.wagmap.jp/itoshima/Map?mid=11&mtp=dm&gprj=3"+ "&mpx=" + latlng.lng + "&mpy=" + latlng.lat + "&mps=" + pascoZl[z]},
    
    },
    "40231":{
    
    
    },
    "40341":{
    
    
    },
    "40342":{"1":{"html":"統合型(地形図)","title":"ささぐりマップ(地形図)","url":"https://www.sonicweb-asp.jp/sasaguri/map?theme=th_23&layers=dm"+ "&mpx=" + latlng.lng + "&mpy=" + latlng.lat + "&mps=" + pascoZl[z]},
    "2":{"html":"(写真)","title":"ささぐりマップ(航空写真)","url":"https://www.sonicweb-asp.jp/sasaguri/map?theme=th_23&layers=ortho"+ "&mpx=" + latlng.lng + "&mpy=" + latlng.lat + "&mps=" + pascoZl[z]},
    "3":{"html":"(住居表示)","title":"ささぐりマップ(住居表示)","url":"https://www.sonicweb-asp.jp/sasaguri/map?theme=th_23"+ "&mpx=" + latlng.lng + "&mpy=" + latlng.lat + "&mps=" + pascoZl[z]},
    },
    "40343":{
    
    
    },
    "40344":{
    
    
    },
    "40345":{"1":{"html":"統合型(都計)","title":"新宮町Webマップ(都市計画情報マップ)","url":"https://www2.wagmap.jp/shingu/Map?mid=6&mtp=dm&gprj=3"+ "&mpx=" + latlng.lng + "&mpy=" + latlng.lat + "&mps=" + pascoZl[z]},
    
    
    },
    "40348":{
    
    
    },
    "40349":{
    
    
    },
    "40381":{
    
    
    },
    "40382":{
    
    
    },
    "40383":{
    
    
    },
    "40384":{
    
    
    },
    "40401":{
    
    
    },
    "40402":{"1":{"html":"G-motty","title":"G-motty 行政情報","url":"https://gmottygyosei-kitakyushu.opendata.arcgis.com/"},
    "2":{"html":"(路線網)","title":"道路路線網図・幅員マップ","url":"https://kitakyushu.maps.arcgis.com/apps/webappviewer/index.html?id=241cf73dbe0247c0bf75c525546089c1"+ "&center=" + arcX + "%2C" + arcY + "%2C102100&level=" + z},
    
    },
    "40421":{
    
    
    },
    "40447":{"1":{"html":"地形図","title":"都市計画基本図","url":"https://chikuzen.maps.arcgis.com/apps/webappviewer/index.html?id=416b748bd39f4c5b872757663bee46b6"+ "&center=" + arcX + "%2C" + arcY + "%2C102100&level=" + z},
    "2":{"html":"都計","title":"都市計画総括図","url":"https://chikuzen.maps.arcgis.com/apps/webappviewer/index.html?id=6d4e560022ff4dc9964332efbfb593d3"+ "&center=" + arcX + "%2C" + arcY + "%2C102100&level=" + z},
    "3":{"html":"路線網","title":"路線網図","url":"https://chikuzen.maps.arcgis.com/apps/webappviewer/index.html?id=dfa89b3bae0b424da52ce62ae606289d"+ "&center=" + arcX + "%2C" + arcY + "%2C102100&level=" + z},
    },
    "40448":{
    
    
    },
    "40503":{
    
    
    },
    "40522":{
    
    
    },
    "40544":{
    
    
    },
    "40601":{"1":{"html":"G-motty","title":"G-motty 行政情報","url":"https://gmottygyosei-kitakyushu.opendata.arcgis.com/"},
    
    
    },
    "40602":{
    
    
    },
    "40604":{
    
    
    },
    "40605":{
    
    
    },
    "40608":{
    
    
    },
    "40609":{
    
    
    },
    "40610":{
    
    
    },
    "40621":{"1":{"html":"G-motty","title":"G-motty 行政情報","url":"https://gmottygyosei-kitakyushu.opendata.arcgis.com/"},
    "2":{"html":"路線網","title":"道路路線網図・幅員マップ #拡大で平面図","url":"https://kitakyushu.maps.arcgis.com/apps/webappviewer/index.html?id=241cf73dbe0247c0bf75c525546089c1"+ "&center=" + arcX + "%2C" + arcY + "%2C102100&level=" + z},
    
    },
    "40625":{"1":{"html":"統合型(地形図)","title":"みやこ町Webマップ(地形図)","url":"https://www2.wagmap.jp/miyako/Map?mid=3&mtp=dm&gprj=3&mcl=-1,-1,-1,-1"+ "&mpx=" + latlng.lng + "&mpy=" + latlng.lat + "&mps=" + pascoZl[z]},
    "2":{"html":"(写真)","title":"みやこ町Webマップ(航空写真)","url":"https://www2.wagmap.jp/miyako/Map?mid=3&mtp=ortho&gprj=3&mcl=-1,-1,-1,-1"+ "&mpx=" + latlng.lng + "&mpy=" + latlng.lat + "&mps=" + pascoZl[z]},
    "3":{"html":"(道路網)","title":"みやこ町Webマップ(道路情報)","url":"https://www2.wagmap.jp/miyako/Map?mid=3&mtp=dm&gprj=3"+ "&mpx=" + latlng.lng + "&mpy=" + latlng.lat + "&mps=" + pascoZl[z]},
    "4":{"html":"(河川網)","title":"みやこ町Webマップ(河川網図)","url":"https://www2.wagmap.jp/miyako/Map?mid=4&mtp=dm&gprj=3"+ "&mpx=" + latlng.lng + "&mpy=" + latlng.lat + "&mps=" + pascoZl[z]},},
    "40642":{
    
    
    },
    "40646":{
    
    
    },
    "40647":{
    
    
    },            
  }