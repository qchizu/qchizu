/************************************************************************
 L.Class
 - GSI.Footer
 ************************************************************************/

 GSI.Footer = L.Evented.extend({

  options: {

  },

  initialize: function (mapManager, parentContainer, options) {
    L.setOptions(this, options);
    this._dispMode = GSI.Footer.DISP_MINI;
    if (this.options.displayMode || this.options.displayMode == 0) {
      try {
        this._dispMode = parseInt(this.options.displayMode);
      } catch (e) { }
    }
    this._mapManager = mapManager;
    this._mapMenu = this._mapManager._mapMenu;
    this._linksData = null; // ★追加部分　CSVデータを保持する変数を追加

    this._mapMenu.on("panelshow", L.bind(this._onMapMenuShow, this));
    this._mapMenu.on("panelresize", L.bind(this._onMepMenuResize, this));
    this._mapMenu.on("panelhide", L.bind(this._onMapMenuHide, this))
    this._mapMenu.on("paneloverlapchange", L.bind(this._onMepMenuOverlapChange, this));

    this._parentContainer = parentContainer;

    this._dispAddrMode = GSI.Footer.DISP_ADDR_KANJI;

    this._loadLinksCSV(); // ★追加部分 CSV の初回読み込み
  },

  // ★追加部分　CSV読み込み用の新しいメソッドを追加
  _loadLinksCSV: function() {
    fetch('qchizu-link.csv')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text();
        })
        .then(csv => {
            csv = csv.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
            const lines = csv.split('\n');
            const headers = lines[0].split(',').map(header => header.trim());
            this._linksData = {};

            // theme_codeとtheme_nameの変換テーブルを追加
            const themeNames = {
                "1": "地形図",
                "2": "オルソ画像", 
                "3": "都市計画",
                "4": "道路",
                "5": "下水道",
                "6": "地番",
                "7": "土砂災害",
                "8": "森林"
            };

            for (let i = 1; i < lines.length; i++) {
                const line = lines[i].trim();
                if (!line) continue;
                
                const values = line.split(',').map(value => value.trim());
                const code = values[0].padStart(6, '0').slice(0, 5);
                
                if (!this._linksData[code]) this._linksData[code] = [];
                
                this._linksData[code].push({
                    html: themeNames[values[2]] || values[2], // theme_codeをtheme_nameに変換
                    siteName: values[1],
                    layerName: values[3],
                    title: `${values[1]} - ${values[3]}`, // site_nameとlayer_nameを組み合わせる
                    urlTemplate: values[4]
                });
            }
        })
        .catch(error => {
            console.error('Error loading CSV:', error);
            this._linksData = {};
        });
},

  setLeft: function () {

  },
  setRight: function (right) {
    this._container.css({ right: right + "px" });
  },

  start: function (dispMode) {

    this._create();
    if (!this.options.visible) {
      this._container.hide();
      return;
    }
    this._setDisplayMode(this._dispMode, true);
    if (this._mapMenu.getPanelVisible() && !this._mapMenu.isPanelOverlap()) {
      var css = {};
      if (this._mapMenu.getPanelPosition() == "right") {
        css["right"] = this._mapMenu.getPanelWidth() + "px";
      } else {
        css["left"] = this._mapMenu.getPanelWidth() + "px";
      }

      this._container.css(css);
    }
    this._refreshLatLng();

    var map = this._mapManager.getMap();

    map.on("movestart", L.bind(this._onMapMoveStart, this));
    map.on("move", L.bind(this._onMapMove, this));
    $(document).on('change', '#zone', L.bind(this._onMapMove, this));    //★変更箇所
    $(document).on('change', '#link1', L.bind(this._onMapMove, this));    //★変更箇所
    $(document).on('change', '#link2', L.bind(this._onMapMove, this));    //★変更箇所
    $(document).on('change', '#link3', L.bind(this._onMapMove, this));    //★変更箇所
    map.on("moveend", L.bind(this._onMapMoveEnd, this));

    if (!this._windowResizeHandler) {
      this._windowResizeHandler = L.bind(this._onWindowResize, this);
      $(window).on("resize", this._windowResizeHandler);
    }
  },

  destroy: function () {

    if (this._windowResizeHandler) {
      $(window).off("resize", this._windowResizeHandler);
      this._windowResizeHandler = null;
    }

    if (this._container) {
      this._container.remove();
      this._container = null;
    }
  },

  _onMepMenuOverlapChange: function (evt) {
    if (evt.overlap) {

      this._container.css({ "left": "0px", "right": "0px" });
    } else {
      var css = {};
      var width = this._mapMenu.getPanelVisible() ? this._mapMenu.getPanelWidth() : 0;
      if (this._mapMenu.getPanelPosition() == "right") {
        css["right"] = width + "px";
      } else {
        css["left"] = width + "px";
      }
      this._container.css(css);

    }
  },

  _onMapMenuShow: function (evt) {
    if (this._mapMenu.isPanelOverlap()) return;
    var animate = {};
    if (evt.position == "right") {
      animate["right"] = evt.width + "px";
    } else {
      animate["left"] = evt.width + "px";
    }
    this._container.animate(animate, evt.duration, L.bind(function () {
      this.refreshSize();
    }, this));
  },
  _onMepMenuResize: function (evt) {
    if (this._mapMenu.isPanelOverlap()) return;
    var css = {};
    if (evt.position == "right") {
      css["right"] = evt.width + "px";
    } else {
      css["left"] = evt.width + "px";
    }

    this._container.css(css);
    this.refreshSize();

  },
  _onMapMenuHide: function (evt) {
    if (this._mapMenu.isPanelOverlap()) return;
    var animate = {};
    if (evt.position == "right") {
      animate["right"] = "0px";
    } else {
      animate["left"] = "0px";
    }
    this._container.animate(animate, evt.duration, L.bind(function () {
      this.refreshSize();
    }, this));
  },
  setDisplayMode: function (dispMode) {
    if (dispMode == true) {
      dispMode = GSI.Footer.DISP_MINI;
    } else if (dispMode == false) {
      dispMode = GSI.Footer.DISP_CLOSE;
    } else {
      dispMode = "" + dispMode;
      switch (dispMode) {
        case "0":
          dispMode = GSI.Footer.DISP_CLOSE;
          break;
        case "2":
          dispMode = GSI.Footer.DISP_LARGE;
          break;
        default:
          dispMode = GSI.Footer.DISP_MINI;
          break;
      }
    }

    if (this._dispMode != dispMode) {
      this._setDisplayMode(dispMode);
    }
  },

  _setDisplayMode: function (dispMode, noAnimation) {
    this._dispMode = parseInt(dispMode);

    switch (this._dispMode) {
      case GSI.Footer.DISP_CLOSE:
        this._startCloseMode(noAnimation);
        break;

      case GSI.Footer.DISP_LARGE:
        this._startLargeMode(noAnimation);
        break;

      default:
        this._startMiniMode(noAnimation);
        break;
    }
  },

  _startCloseMode: function (noAnimation) {

    if (CONFIG.TOOLTIP && CONFIG.TOOLTIP.CONTEXTMENU) {
      this._button.attr({ "title": CONFIG.TOOLTIP.CONTEXTMENU.BTN_HIDE });
    } else {
      this._button.attr({ "title": "" });
    }
    var after = L.bind(function () {
      this._addrContainer.hide();
      this._latlngContainer.hide();
      this._cdContainer.hide(); //★★変更箇所
      this._utmContainer.hide();
      this._linkContainer.hide(); //★★変更箇所
      this._elevationContainer.hide();
      this._lakeDepthContainer.hide();
      this._seamlessContainer.hide();
      this._container.addClass("close");
      this._container.removeClass("large");
    }, this);
    this._container.css({ "min-height": "auto" });
    if (noAnimation) {
      after();
      this._contentSizeChange();
    } else {

      this._container.stop().animate({ "height": 0 + "px" }, 300, L.bind(function () {
        after();
        this._contentSizeChange();
        this._execRefresh();
      }, this));
    }
  },

  _startLargeMode: function (noAnimation) {
    if (CONFIG.TOOLTIP && CONFIG.TOOLTIP.CONTEXTMENU) {
      this._button.attr({ "title": CONFIG.TOOLTIP.CONTEXTMENU.BTN_SHOW });
    } else {
      this._button.attr({ "title": "" });
    }
    var after = L.bind(function () {
      this._addrContainer.show();
      this._latlngContainer.show();
      this._cdContainer.show();  //★★変更箇所
      this._utmContainer.show();
      this._linkContainer.show(); //★★変更箇所
      this._elevationContainer.show();
      if(this._lakeDepthEnabled) this._lakeDepthContainer.show();
      if (this._seamlessPhotoVisible) this._seamlessContainer.show();
      else this._seamlessContainer.hide();
    }, this);

    this._elevationContainer.css({
      "display": "block",
      "vertical-align": "middle",
      "height": "auto",
    });

    if (noAnimation) {
      after();
      this._container.removeClass("close");
      this._container.addClass("large");
    } else {
      var fromHeight = this._container.outerHeight();
      after();
      var toHeight = this._container.outerHeight();
      this._container.css({ "height": fromHeight + "px" });

      this._container.stop().animate({ "height": toHeight + "px" }, 300, L.bind(function () {

        this._container.removeClass("close");
        this._container.addClass("large");
        this._container.css({ "height": "auto" });
        this._contentSizeChange();
        this._execRefresh();
      }, this));
    }
  },

  _startMiniMode: function (noAnimation) {
    if (CONFIG.TOOLTIP && CONFIG.TOOLTIP.CONTEXTMENU) {
      this._button.attr({ "title": CONFIG.TOOLTIP.CONTEXTMENU.BTN_MINI });
    } else {
      this._button.attr({ "title": "" });
    }
    var after = L.bind(function () {
      this._addrContainer.hide();
      this._latlngContainer.hide();
      this._cdContainer.hide();  //★★変更箇所
      this._utmContainer.hide();
      this._linkContainer.hide(); //★★変更箇所
      this._elevationContainer.show();
      this._lakeDepthContainer.hide();
      if (this._seamlessPhotoVisible) this._seamlessContainer.show();
      else this._seamlessContainer.hide();
      this._container.css({ "height": "auto" });
    }, this);

    if (!this._seamlessPhotoVisible) {
      this._elevationContainer.css({
        "display": "table-cell",
        "vertical-align": "middle",
        "height": "34px",
      });
    } else {
      this._elevationContainer.css({
        "display": "block",
        "vertical-align": "middle",
        "height": "auto",
      });
    }

    if (noAnimation) {
      this._container.css({ "min-height": "34px" });
      this._container.removeClass("close");
      this._container.removeClass("large");
      after();
    } else {
      var fromHeight = this._container.outerHeight();
      after();
      var toHeight = this._container.outerHeight();
      if (toHeight < 34) toHeight = 34;
      this._container.css({ "height": fromHeight + "px" });

      this._container.stop().animate({ "height": toHeight + "px" }, 300, L.bind(function () {

        this._container.css({ "min-height": "34px" });
        this._container.removeClass("close");
        this._container.removeClass("large");
        this._container.css({ "height": "auto" });
        this._contentSizeChange();
        this._execRefresh();
      }, this));
    }
  },

  getDisplayMode: function () {
    return this._dispMode;
  },

  _onWindowResize: function () {
    this.refreshSize();
  },

  refreshSize: function () {
    var map = this._mapManager.getMap();
    var mapSize = map.getSize();

    if (mapSize.x > 550) {
      this._addrContainer.find(".mini-comment").removeClass("block");
    } else {
      this._addrContainer.find(".mini-comment").addClass("block");
    }

    this._contentSizeChange();
  },

  getHeight: function () {
    return this._container.outerHeight();
  },

  _contentSizeChange: function () {
    if (!this._container) return;

    var containerHeight = this._container.outerHeight();
    var buttonHeight = this._dispMode == GSI.Footer.DISP_CLOSE ? 34 : 0;
    if (!this.options.visible) {
      containerHeight = 0;
      buttonHeight = 0;
    }
    this.fire("resize", { "height": containerHeight, "withButtonHeight": containerHeight + buttonHeight })

  },

  _create: function () {
    if (this._container) return;

    this._container = $("<div>").addClass("gsi-footer-container");
    // 開閉ボタン
    this._button = $("<a>").addClass("gsi-footer-button").attr({ "href": "javascript:void(0);" });
    this._button.addClass("strong");

    this._container.append(this._button);
    this._button.on("click", L.bind(this._onDisplayModeButtonClick, this));
    // 住所
    this._addrContainer = this._createAddrContainer(this._container);

    // 緯度軽度
    this._latlngContainer = this._createLatLngContainer(this._container);

    // 平面直角座標　★★変更箇所
    this._cdContainer = this._createCdContainer(this._container);

    // UTMポイント
    this._utmContainer = this._createUTMPointContainer(this._container);

    // リンク　★★変更箇所
    this._linkContainer = this._createLinkContainer(this._container);

    // 標高
    this._elevationContainer = this._createElevationContainer(this._container);

    // 湖水深
    this._lakeDepthContainer = this._createLakeDepthContainer(this._container);

    // シームレス
    this._seamlessContainer = this._createSeamlessContainer(this._container);
  
      // 表示値の説明　★変更（次の行「表示値の説明」→「説明」に変更　など）
      this._descriptionButton = $("<a>").addClass("description-button").html("説明")
        .attr({ "target": "_blank", "href": "https://maps.gsi.go.jp/help/howtouse.html#h2-3" ,"title":"表示値の説明"})
        .css("width","40px")
        .css("height","25px")
        .css("padding","3px 0px 3px 0px")
        .css("text-align","center")
      if (CONFIG.MOBILE) {
        this._descriptionButton.html("i").addClass("mobile").css("width","28px").css("padding","0");
      }
      this._container.append(this._descriptionButton);
  
      this._parentContainer.append(this._container);
  
    },

  _onDisplayModeButtonClick: function () {
    this._button.removeClass("strong");
    var dispMode = this._dispMode + 1;
    if (dispMode > 2) dispMode = 0;
    this._setDisplayMode(dispMode);
  },

  _onLargeModeAddrChangeClick: function(){
    if (this._dispAddrMode == GSI.Footer.DISP_ADDR_KANJI){
      this._dispAddrMode = GSI.Footer.DISP_ADDR_YOMI;
      this._addrChangeReading.html("漢");
    }
    else{
      this._dispAddrMode = GSI.Footer.DISP_ADDR_KANJI;
      this._addrChangeReading.html("あ");
    }
    var map = this._mapManager.getMap();
    if (!map) return;

    GSI.Utils.sendSelectedFunction("addr-change");

    var center = map.getCenter().wrap();
    var z = map.getZoom();
    this._loadAddr(center, z);
  },

  // 住所　表示用コンテナ作成
  _createAddrContainer: function (parentContainer) {
    var container = $("<div>").addClass("item-frame");
    this._addrChangeReading = $("<span>").addClass("addr-ToActive").html("あ");
    this._addrView = $("<span>").addClass("address").html("---");
    this._pref = $("<span>").addClass("pref").html("---");//★変更箇所
    this._prefLink1 = $("<a>").addClass("pref-link").html("---").attr({ "target": "_blank", "href": "アドレス" ,"title":"タイトル"})
                    .css("background","#e6b422"); //★変更箇所
    this._prefLink2 = $("<a>").addClass("pref-link").html("").attr({ "target": "_blank", "href": "アドレス" ,"title":"タイトル"})
                    .css("background","#e6b422"); //★変更箇所
    this._prefLink3 = $("<a>").addClass("pref-link").html("").attr({ "target": "_blank", "href": "アドレス" ,"title":"タイトル"})
                    .css("background","#e6b422"); //★変更箇所
    this._prefLink4 = $("<a>").addClass("pref-link").html("").attr({ "target": "_blank", "href": "アドレス" ,"title":"タイトル"})
                    .css("background","#e6b422"); //★変更箇所
    this._city = $("<span>").addClass("city").html("---");//★変更箇所
    this._cityLink1 = $("<a>").addClass("city-link").html("---").attr({ "target": "_blank", "href": "アドレス" ,"title":"タイトル"})
                    .css("background","#e6b422"); //★変更箇所
    this._cityLink2 = $("<a>").addClass("city-link").html("").attr({ "target": "_blank", "href": "アドレス" ,"title":"タイトル"})
                    .css("background","#e6b422"); //★変更箇所
    this._cityLink3 = $("<a>").addClass("city-link").html("").attr({ "target": "_blank", "href": "アドレス" ,"title":"タイトル"})
                    .css("background","#e6b422"); //★変更箇所
    this._cityLink4 = $("<a>").addClass("city-link").html("").attr({ "target": "_blank", "href": "アドレス" ,"title":"タイトル"})
                    .css("background","#e6b422"); //★変更箇所
    var nbsp2 = $("<span>").html("&nbsp;&nbsp;");
    var comment = $("<span>").addClass("mini-comment").html("(注)").attr({ "title":"付近の住所。正確な所属を示すとは限らない。"});
    var qchizuLinkComment = $("<span>").addClass("qchizu-link").html(" 自治体等の地図: ").attr({ "title":"都道府県、市町村等の地図サイトへのリンク"}).css("color","#ccc");
    this._addrView.on('click', L.bind(this._onLargeModeAddrChangeClick, this));
    this._addrChangeReading.on('click', L.bind(this._onLargeModeAddrChangeClick, this));

    container.append(this._addrChangeReading).append(nbsp2).append(this._addrView).append(comment).append(qchizuLinkComment). //★変更箇所
    append(this._pref).append(this._prefLink1).append(" ").append(this._prefLink2).append(" ").append(this._prefLink3).append(" ").append(this._prefLink4). //★変更箇所
    append(this._city).append(this._cityLink1).append(" ").append(this._cityLink2).append(" ").append(this._cityLink3).append(" ").append(this._cityLink4); //★変更箇所
    parentContainer.append(container);
    return container;
  },

  // 緯度経度　表示用コンテナ作成
  _createLatLngContainer: function (parentContainer) {

    var container = $("<div>").addClass("item-frame");

    // 60
    this._latlng60Container = $("<div>").addClass("inline").addClass("marginright");
    this._latlng60View = $("<span>").addClass("latlng60");
    this._latlng60Container.append(this._latlng60View);

    // 10
    this._latlng10Container = $("<div>").addClass("inline");
    this._latlng10View = $("<span>").addClass("latlng10");
    var zoomHeading = $("<span>").addClass("heading").addClass("zoom").html("ズーム:");
    this._zoomView = $("<span>").addClass("zoom");

    //★★変更箇所　測地系変換
    this._latlngJgd2tkyButton = $("<a>")
      .addClass("description-button")
      .html("変換")
      .attr({
        "id": "latlngJgd2tkyButton",
        "target": "_blank",
        "href": "アドレス",
        "title": "国土地理院APIを使用して、経緯度を日本測地系に変換します。"
      })
      .css({
        "background": "#e6b422",
        "height": "20px",
        "right": "initial",
        "bottom": "initial",
        "padding": "1px 7px 0px 7px",
        "position": "relative"
      });

    this._latlng10Container.append(this._latlng10View).append(zoomHeading).append(this._zoomView).append($("<span>").text("　")).append(this._latlngJgd2tkyButton); //★★変更箇所

    container.append(this._latlng60Container).append(this._latlng10Container);
    parentContainer.append(container);
    return container;
  },

  // 平面直角座標　表示用コンテナ作成
  _createCdContainer: function (parentContainer) {
    var container = $("<div>").addClass("item-frame");

    this._cdContainer = $("<div>").addClass("inline");

    // ヘッダー
    var cdHeading = $("<span>").addClass("heading").html("平面直角座標 第");

    // 測地系選択
    var selectBox = $("<select>").attr({"id": "zone"});
    var option1 = $("<option>").val("1").text("1").attr("title","長崎 甑島列島 吐噶喇列島 奄美群島");
    var option2 = $("<option>").val("2").text("2").attr("title","福岡 佐賀 熊本 大分 宮崎 鹿児島");
    var option3 = $("<option>").val("3").text("3").attr("title","山口 島根 広島");
    var option4 = $("<option>").val("4").text("4").attr("title","香川 愛媛 徳島 高知");
    var option5 = $("<option>").val("5").text("5").attr("title","兵庫 鳥取 岡山");
    var option6 = $("<option>").val("6").text("6").attr("title","京都 大阪 福井 滋賀 三重 奈良 和歌山");
    var option7 = $("<option>").val("7").text("7").attr("title","石川 富山 岐阜 愛知");
    var option8 = $("<option>").val("8").text("8").attr("title","新潟 長野 山梨 静岡");
    var option9 = $("<option>").val("9").text("9").attr("title","東京 福島 栃木 茨城 埼玉 千葉 群馬 神奈川").attr("selected", true);
    var option10 = $("<option>").val("10").text("10").attr("title","青森 秋田 山形 岩手 宮城");
    var option11 = $("<option>").val("11").text("11").attr("title","北海道西部");
    var option12 = $("<option>").val("12").text("12").attr("title","北海道中部");
    var option13 = $("<option>").val("13").text("13").attr("title","北海道東部");
    var option14 = $("<option>").val("14").text("14").attr("title","小笠原諸島");
    var option15 = $("<option>").val("15").text("15").attr("title","沖縄本島");
    var option16 = $("<option>").val("16").text("16").attr("title","先島諸島");
    var option17 = $("<option>").val("17").text("17").attr("title","大東諸島");
    var option18 = $("<option>").val("18").text("18").attr("title","沖ノ鳥島");
    var option19 = $("<option>").val("19").text("19").attr("title","南鳥島");
    var option101 = $("<option>").val("101").text("旧1").attr("title","EPSG:30161");
    var option102 = $("<option>").val("102").text("旧2").attr("title","EPSG:30162");
    var option103 = $("<option>").val("103").text("旧3").attr("title","EPSG:30163");
    var option104 = $("<option>").val("104").text("旧4").attr("title","EPSG:30164");
    var option105 = $("<option>").val("105").text("旧5").attr("title","EPSG:30165");
    var option106 = $("<option>").val("106").text("旧6").attr("title","EPSG:30166");
    var option107 = $("<option>").val("107").text("旧7").attr("title","EPSG:30167");
    var option108 = $("<option>").val("108").text("旧8").attr("title","EPSG:30168");
    var option109 = $("<option>").val("109").text("旧9").attr("title","EPSG:30169");
    var option110 = $("<option>").val("110").text("旧10").attr("title","EPSG:30170");
    var option111 = $("<option>").val("111").text("旧11").attr("title","EPSG:30171");
    var option112 = $("<option>").val("112").text("旧12").attr("title","EPSG:30172");
    var option113 = $("<option>").val("113").text("旧13").attr("title","EPSG:30173");
    var option114 = $("<option>").val("114").text("旧14").attr("title","EPSG:30174");
    var option115 = $("<option>").val("115").text("旧15").attr("title","EPSG:30175");
    var option116 = $("<option>").val("116").text("旧16").attr("title","EPSG:30176");
    var option117 = $("<option>").val("117").text("旧17").attr("title","EPSG:30177");
    var option118 = $("<option>").val("118").text("旧18").attr("title","EPSG:30178");
    var option119 = $("<option>").val("119").text("旧19").attr("title","EPSG:30179");
    //  selectBox.append(option1).append(option2).append(option3).append(option4).append(option5).append(option6).append(option7).append(option8).append(option9).append(option10).append(option11).append(option12).append(option13).append(option14).append(option15).append(option16).append(option17).append(option18).append(option19).append(option101).append(option102).append(option103).append(option104).append(option105).append(option106).append(option107).append(option108).append(option109).append(option110).append(option111).append(option112).append(option113).append(option114).append(option115).append(option116).append(option117).append(option118).append(option119);
    selectBox.append(option1).append(option2).append(option3).append(option4).append(option5).append(option6).append(option7).append(option8).append(option9).append(option10).append(option11).append(option12).append(option13).append(option14).append(option15).append(option16).append(option17).append(option18).append(option19);

    // ヘッダー
    var cdHeading2 = $("<span>").addClass("heading").html("系: ");

    // 座標
    this._cdView = $("<span>").addClass("cd").attr({"id": "cdView"});

      // 測地系変換ボタン
      this._cdJgd2tkyButton = $("<a>")
        .addClass("description-button")
        .html("変換")
        .attr({
          "id": "cdJgd2tkyButton",
          "target": "_blank",
          "href": "アドレス",
          "title": "国土地理院APIを使用して、平面直角座標を日本測地系に変換します。"
        })
        .css({
          "background": "#e6b422",
          "height": "20px",
          "right": "initial",
          "bottom": "initial",
          "padding": "1px 7px 0px 7px",
          "position": "relative"
        });

    // スペース（空白）
    var space = $("<span>").text("　");

    this._cdContainer.append(cdHeading).append(selectBox).append(cdHeading2).append(this._cdView).append(space).append(this._cdJgd2tkyButton);

    container.append(this._cdContainer)
    parentContainer.append(container);
    return container;
  },

  // UTMポイント　表示用コンテナ作成
  _createUTMPointContainer: function (parentContainer) {

    var container = $("<div>").addClass("item-frame");
    var heading = $("<span>").addClass("heading").html("UTMポイント:");
    this._utmView = $("<span>").addClass("utm").html("");

    container.append(heading).append(this._utmView);
    parentContainer.append(container);
    return container;
  },

// リンク（詳細）　表示用コンテナ作成 ★変更箇所
_createLinkContainer: function (parentContainer) {
  var container = $("<div>").addClass("item-frame");

  this._linkContainer = $("<div>").addClass("inline");

  // ヘッダー
  var linkHeading = $("<span>").addClass("heading").html("リンク:");

  // リンクボタン作成
  function createButton(text, title) {
    var button = $("<a>")
      .addClass("description-button")
      .html(text)
      .attr({
        "target": "_blank",
        //"href": "アドレス",
        "title": title
      })
      .css({
        "background": "#e6b422",
        "height": "24px",
        "right": "initial",
        "bottom": "initial",
        "padding": "2px 0px 0px 0px",
        "text-align": "center",
        "position": "relative"
      });
    return button;
  }

  //幅を指定
  var selectBoxWidth = CONFIG.MOBILE ? "70px" : "100px";
  var linkButtonWidth = CONFIG.MOBILE ? "30px" : "40px";

  // リンク選択
  var selectBox1 = $("<select>").attr({"id": "link1" ,style:"width: " + selectBoxWidth + ";"});
  var initialOption = $("<option>").text("=公的=").prop("disabled", true).prop("selected", true);
  var option1 = $("<option>").text("地理院地図").attr("title","【地理院】地理院地図");
  var option2 = $("<option>").text("vector").attr("title","【地理院】地理院地図vector");
  var option3 = $("<option>").text("地図・写真").attr("title","【地理院】地図・空中写真閲覧サービス");
  var option4 = $("<option>").text("ﾊｻﾞｰﾄﾞﾏｯﾌﾟ").attr("title","【地理院】重ねるハザードマップ");
  var option5 = $("<option>").text("基準点").attr("title","【地理院】基準点成果等閲覧サービス");
  var option6 = $("<option>").text("ひなたGIS").attr("title","【宮崎県】ひなたGIS");
  var option7 = $("<option>").text("地質図Navi").attr("title","【産総研】地質図Navi");
  var option8 = $("<option>").text("ｼｰﾑﾚｽ地質図").attr("title","【産総研】日本シームレス地質図V2");
  var option9 = $("<option>").text("J-SHIS").attr("title","【防災科研】J-SHIS Map");
  var option10 = $("<option>").text("文化財総覧").attr("title","【奈文研】文化財総覧WebGIS");
  selectBox1.append(initialOption).append(option1).append(option2).append(option3).append(option4).append(option5).append(option6).append(option7).append(option8).append(option9).append(option10);
  this._goLink1Button = createButton("GO", "選択したリンク先を開く").attr({"id": "goLink1Button"}).css("width",linkButtonWidth);

  var selectBox2 = $("<select>").attr({"id": "link2" ,style:"width: " + selectBoxWidth + ";"});
  var initialOption = $("<option>").text("=民間=").prop("disabled", true).prop("selected", true);
  var option1 = $("<option>").text("Google地図").attr("title","Googleマップ(地図)");
  var option2 = $("<option>").text("Google写真").attr("title","Googleマップ(写真)");
  var option3 = $("<option>").text("ｽﾄﾘｰﾄﾋﾞｭｰ").attr("title","Googleストリートビュー");
  var option4 = $("<option>").text("Yahoo!地図").attr("title","Yahoo!マップ(地図)");
  var option5 = $("<option>").text("Yahoo!写真").attr("title","Yahoo!マップ(写真)");
  var option6 = $("<option>").text("Mapion").attr("title","Mapion");
  var option7 = $("<option>").text("MapFan").attr("title","MapFan");
  var option8 = $("<option>").text("いつもNAVI").attr("title","いつもNAVI");
  var option9 = $("<option>").text("Bing Maps").attr("title","Bing Maps");
  var option10 = $("<option>").text("MAPPLEﾍﾞｸ").attr("title","【マップル】MAPPLEのベクトルタイル");
  var option11 = $("<option>").text("MAPPLE×GS").attr("title","【マップル】MAPPLE×GEOSPACE");
  var option12 = $("<option>").text("MAPPLE法").attr("title","【マップル】MAPPLE法務局地図ビューア");
  var option13 = $("<option>").text("MAPPLEﾙｰﾄ").attr("title","【マップル】MAPPLEのルート探索");
  var option14 = $("<option>").text("OSM").attr("title","OpenStreetMap");
  var option15 = $("<option>").text("F4map").attr("title","F4map");
  var option16 = $("<option>").text("今昔マップ").attr("title","今昔マップ");
  var option17 = $("<option>").text("地価マップ").attr("title","【評価センター】全国地価マップ");
  var option18 = $("<option>").text("ヤマタイム").attr("title","【ヤマケイ】ヤマタイム");
  var option19 = $("<option>").text("at home賃貸").attr("title","at home 賃貸");
  selectBox2.append(initialOption).append(option1).append(option2).append(option3).append(option4).append(option5).append(option6).append(option7).append(option8).append(option9).append(option10).append(option11).append(option12).append(option13).append(option14).append(option15).append(option16).append(option17).append(option18).append(option19);
  this._goLink2Button = createButton("GO", "選択したリンク先を開く").attr({"id": "goLink2Button"}).css("width",linkButtonWidth);

  var selectBox3 = $("<select>").attr({"id": "link3" ,style:"width: " + selectBoxWidth + ";"});
  var initialOption = $("<option>").text("=個人=").prop("disabled", true).prop("selected", true);
  var option1 = $("<option>").text("MapLibre版").attr("title","全国Ｑ地図MapLibre版");
  var option2 = $("<option>").text("o-hinata").attr("title","【kenzkenz】open-hinata");
  var option3 = $("<option>").text("shi法務局").attr("title","【【shi-works】法務局地図XML(PMTiles)");
  var option4 = $("<option>").text("shiハザード").attr("title","【shi-works】ハザードマップ(PMTiles)");
  var option5 = $("<option>").text("昔の境界").attr("title","【地図地理Sandbox】むかしの市町村境界マップ");
  var option6 = $("<option>").text("スーパー地形").attr("title","【地理院】スーパー地形");
  selectBox3.append(initialOption).append(option1).append(option2).append(option3).append(option4).append(option5);
  if (CONFIG.MOBILE) {selectBox3.append(option6)};
  this._goLink3Button = createButton("GO", "選択したリンク先を開く").attr({"id": "goLink3Button"}).css("width",linkButtonWidth);

  this._googleMapLinkButton = createButton("G", "Googleマップ(地図)").attr({"id": "googleLinkButton"}).css("width",linkButtonWidth);
  this._streetViewLinkButton = createButton("ビュー", "Googleストリートビュー").attr({"id": "streetViewLinkButton"}).css("width",linkButtonWidth);
  this._mapLibreLinkButton = createButton("ML版", "全国Ｑ地図MapLibre版").attr({"id": "mapLibreLinkButton"}).css("width",linkButtonWidth);

  this._linkContainer
  .append(linkHeading)
  .append(selectBox1)
  .append("　")
  .append(this._goLink1Button)
  .append("　")
  .append(selectBox2)
  .append("　")
  .append(this._goLink2Button)
  .append("　")
  .append(selectBox3)
  .append("　")
  .append(this._goLink3Button);

  if (!CONFIG.MOBILE) {
    this._linkContainer
      .append("　　")
      .append(this._googleMapLinkButton)
      .append("　")
      .append(this._streetViewLinkButton)
      .append("　")
      .append(this._mapLibreLinkButton);
  }

  container.append(this._linkContainer)
  parentContainer.append(container);
  return container;
  },

  // 標高　表示用コンテナ作成
  _createElevationContainer: function (parentContainer) {
    var container = $("<div>").addClass("item-frame");
    var heading = $("<span>").addClass("heading").html("標高:");
    this._elevationView = $("<span>").addClass("elevation").html("---");
    this._elevationComment = $("<span>").addClass("mini-comment").html("");

    container.append(heading).append(this._elevationView).append(this._elevationComment);
    parentContainer.append(container);
    return container;
  },

  // 湖水深など　表示用コンテナ作成
  _createLakeDepthContainer: function (parentContainer) {
    const strNoData = "---";
    var container = $("<div>").addClass("item-frame");
    var lakeDepthLabel = $("<span>").addClass("heading").html("湖水深: ");
    this._lakeDepthView = $("<span>").addClass("lakeinfo").html(strNoData);
    var lakeBtmHeightLabel = $("<span>").addClass("heading").html("（湖底標高: ");
    this._lakeBtmHeightView = $("<span>").addClass("lakeinfo").html(strNoData);
    var lakeStdHeightLabel = $("<span>").addClass("heading").html("　基準水面標高: ");
    this._lakeStdHeightView = $("<span>").addClass("lakeinfo").html(strNoData);
    var end = $("<span>").addClass("heading").html(")");

    container.append(lakeDepthLabel).append(this._lakeDepthView)
    .append(lakeBtmHeightLabel).append(this._lakeBtmHeightView)
    .append(lakeStdHeightLabel).append(this._lakeStdHeightView)
    .append(end);

    parentContainer.append(container);
    return container;
  },

  _createSeamlessContainer: function (parentContainer) {

    var container = $("<div>").addClass("item-frame");
    var heading = $("<span>").addClass("heading").html("全国最新写真(シームレス)撮影期間:");
    this._seamlessView = $("<span>").addClass("seamless").html("---");

    container.append(heading).append(this._seamlessView).append();
    parentContainer.append(container);
    return container;
  },

  _refreshLatLng: function () {
    var map = this._mapManager.getMap();
    if (!map) return;

    var center = map.getCenter().wrap();
    var dms = GSI.Utils.latLngToDMS(center);

    var lats = (Math.round(dms.lat.s * 100) / 100).toFixed(2);
    var lngs = (Math.round(dms.lng.s * 100) / 100).toFixed(2);
    if ('' + lats == "60.00") {
      lats = "0.00";
      dms.lat.m += 1;
    }
    if ('' + lngs == "60.00") {
      lngs = "0.00";
      dms.lng.m += 1;
    }
    if (dms.lat.m == 60){
      dms.lat.m = 0;
      dms.lat.d += 1;
    }
    if (dms.lng.m == 60){
      dms.lng.m = 0;
      dms.lng.d += 1;
    }
    this._latlng60View.html(
      (center.lat < 0 ? '-' : '') + dms.lat.d + '度' + dms.lat.m + '分' + lats + '秒'
      + '&nbsp;' +
      (center.lng < 0 ? '-' : '') + dms.lng.d + '度' + dms.lng.m + '分' + lngs + '秒'
    );

    this._latlng10View.html(
      (Math.round(center.lat * 1000000) / 1000000).toFixed(6)
      + ','
      + (Math.round(center.lng * 1000000) / 1000000).toFixed(6)
    );

    //★変更（日本測地系への変換、ズームレベルの変換；2945行目あたりからコピーしてz→map.getZoom()に変更）
    var japanP = GSI.Utils.world2Japan(center);
    var y = Math.round(japanP.y * 3600 * 1000);
    var x = Math.round(japanP.x * 3600 * 1000);

    //★変更
    var jgdbl = (Math.round(center.lat * 1000000) / 1000000).toFixed(6) + ','  + (Math.round(center.lng * 1000000) / 1000000).toFixed(6);
    var zone = $("#zone").val();
    var jgdxyP = GSI.Utils.bl2xy(center,zone);
    var jgdy = (Math.round(jgdxyP.y * 10) / 10).toFixed(1);
    var jgdx = (Math.round(jgdxyP.x * 10) / 10).toFixed(1);
    var cdjgdxy2tkylink = "https://vldb.gsi.go.jp/sokuchi/surveycalc/tky2jgd/tky2jgd.pl?outputType=json&sokuti=2&Place=2&zone=" + zone + "&publicX=" + Math.round(jgdxyP.y * 1000 ) / 1000 + "&publicY=" + Math.round(jgdxyP.x * 1000 ) / 1000 ;
    var latlngJgd2tkylink = "https://vldb.gsi.go.jp/sokuchi/surveycalc/tky2jgd/tky2jgd.pl?outputType=json&sokuti=2&Place=1&latitude=" + center.lat + "&longitude=" + center.lng ;

    //★変更
    let z = parseInt(map.getZoom());
    let lat = center.lat.toFixed(6);
    let lng = center.lng.toFixed(6);
    let wmlatlng = GSI.Utils.bl2xy(center,0); //Web Mercator座標計算
    let arcX = parseInt(wmlatlng.x - 40075017); //arcgis用 40075017 は、6378137(EPSG3857の半径) *2 *円周率 で算出
    let arcY = parseInt(wmlatlng.y);
    let m = (156543.03392 * Math.cos(lat * (Math.PI / 180)) / Math.pow(2,z)) * 256 * 3.624851322; //１タイルの長さ（m）に実際の変換から導き出した定数3.624851322をかけたもの
    let pascoZl = {
      "8" :"1000000",
      "9" :"1000000",
      "10": "500000",
      "11": "200000",
      "12": "100000",
      "13":  "50000",
      "14":  "25000",
      "15":  "25000",
      "16":  "10000",
      "17":   "5000",
      "18":   "2500",
      "19":   "1000",
      "20":    "500",
      "21":    "500",
      "22":    "500",
      "23":    "500",
      "24":    "500",
    };
    let kkcZl = Math.floor(491520000 / (2 ** z) );
    let ajikoZl = Math.floor(589824000 / (2 ** z) );
    
    //★変更
    $("#cdView").text(' ' + jgdy + ',' + jgdx);
    $("#cdJgd2tkyButton").attr('href', cdjgdxy2tkylink);
    $("#latlngJgd2tkyButton").attr('href', latlngJgd2tkylink);

    //★変更
    var selectedLink1 = $("#link1 option:selected").text();
    var link1Url = {
      "地理院地図": "https://maps.gsi.go.jp/#" + z + "/" + lat + "/" + lng,
      "vector": "https://maps.gsi.go.jp/vector/#" + (z-1) + "/" + lat + "/" + lng + "/&ls=vstd&disp=1&d=l",
      "地図・写真": "https://mapps.gsi.go.jp/maplibSearch.do?centerLat=" + lat + "&centerLon=" + lng + "&zoomLevel=" + z + "&did=pale",
      "ﾊｻﾞｰﾄﾞﾏｯﾌﾟ": "https://disaportal.gsi.go.jp/maps/?ll=" + lat + "," + lng + "&z=" + z + "&base=pale&vs=c1j0l0u0",
      "基準点": "https://sokuseikagis1.gsi.go.jp/index.aspx#" + z + "/" + lat + "/" + lng + "/&base=std&ls=std&disp=1&vs=c1z0f0",
      "ひなたGIS": "https://hgis.pref.miyazaki.lg.jp/hinata/hinata.html#" + z + "/" + lat + "/" + lng + "&l=%5B%5B%7B%22n%22:%22pale%22,%22o%22:1,%22z%22:-2%7D,%7B%22n%22:%22MapWarperStanford%22,%22o%22:1,%22z%22:0%7D%5D,%5B%7B%22n%22:%22pale%22,%22o%22:1,%22z%22:151%7D%5D%5D",
      "地質図Navi": "https://gbank.gsj.jp/geonavi/geonavi.php#" + z + "," + lat + "," + lng,
      "ｼｰﾑﾚｽ地質図": "https://gbank.gsj.jp/seamless/v2/viewer/?center=" + lat + "%2C" + lng + "&z=" + Math.min(z,13),
      "J-SHIS": "https://www.j-shis.bosai.go.jp/map/?center=" + lng + "," + lat + "&zoom=" + Math.min(z,15) + "&flt=0,0,0,0&transparent=0.2&layer=P-Y2020-MAP-AVR-TTL_MTTL-T30_I55_PD2&epoch=Y2020&ls=0&lang=jp",
      "文化財総覧": "https://heritagemap.nabunken.go.jp/main?lat=" + lat + "&lng=" + lng + "&zoom=" +  (z-1),
      };
    $("#goLink1Button").attr('href', link1Url[selectedLink1]);

    //★変更
    var selectedLink2 = $("#link2 option:selected").text();
    var link2Url = {
      "Google地図": "https://www.google.com/maps/place/" + lat + "," + lng + "/@" + lat + "," + lng + "," + z + "z",
      "Google写真": "https://www.google.com/maps/place/" + lat + "," + lng + "/@" + lat + "," + lng + "," + m + "m/data=!3m1!1e3",
      "ｽﾄﾘｰﾄﾋﾞｭｰ": "https://www.google.com/maps/@?api=1&map_action=pano&parameters&viewpoint=" + lat + "," + lng,
      "Yahoo!地図": "https://map.yahoo.co.jp/place?lat=" + lat + "&lon=" + lng + "&zoom=" + (z-1) + "&maptype=basic",
      "Yahoo!写真": "https://map.yahoo.co.jp/place?lat=" + lat + "&lon=" + lng + "&zoom=" + (z-1) + "&maptype=satellite",
      "Mapion": "https://www.mapion.co.jp/m2/"+lat+","+lng+","+z,
      "MapFan": "https://mapfan.com/map?c="+lat+","+lng+","+z+"&s=std,pc,ja&p=none",
      "いつもNAVI": "https://www.its-mo.com/maps/?lat=" + y + "&lon=" + x + "&zoom=" + (z-5) + "&share=true",
      "Bing Maps": "http://www.bing.com/maps/?v=2&cp="+lat+"~"+lng+"&lvl="+z+"&style=h",
      "MAPPLEﾍﾞｸ": "https://labs.mapple.com/mapplevt.html#" + (z-1) + "/" + lat + "/" + lng,
      "MAPPLE×GS": "https://labs.mapple.com/mapplegeospace.html#" + (z-1) + "/" + lat + "/" + lng,
      "MAPPLE法": "https://labs.mapple.com/mapplexml.html#" + (z-1) + "/" + lat + "/" + lng,
      "MAPPLEﾙｰﾄ": "https://labs.mapple.com/mappleroute.html#" + (z-1) + "/" + lat + "/" + lng,
      "OSM": "https://www.openstreetmap.org/#map=" + z + "/" + lat + "/" + lng,
      "F4map": "https://demo.f4map.com/#lat=" + lat + "&lon=" + lng + "&zoom=" + z,
      "今昔マップ": "https://ktgis.net/kjmapw/kjmapw.html?lat="+lat+"&lng="+lng+"&zoom="+z+"&mapOpacity=10&overGSItile=no&altitudeOpacity=2",
      "地価マップ": "https://www.chikamap.jp/chikamap/Map?mid=222&bsw=1903&bsh=977" + "&mpx=" + japanP.x + "&mpy=" + japanP.y + "&mps=" + pascoZl[z],
      "ヤマタイム": "https://www.yamakei-online.com/yk_map/?latlon=" + lat + "," + lng + "&zoom=" + Math.min(z,17),
      "docomoエリア": "https://www.docomo.ne.jp/area/servicearea/?rgcd=03&cmcd=5G&scale=2048000&lat=35.690767&lot=139.756853&icid=CRP_IPH_area-5g_to_CRP_AREA_servicearea",
      "at home賃貸": "https://www.athome.co.jp/chintai/fukuoka/map/list/?LAT=" + lat + "&LON=" + lng,
    };
    $("#goLink2Button").attr('href', link2Url[selectedLink2]);

    //★変更
    var selectedLink3 = $("#link3 option:selected").text(); 
    var link3Url = {
      "MapLibre版": "https://maps.qchizu.xyz/maplibre/#" + (z-1) + "/" + lat + "/" + lng,
      "o-hinata": "https://kenzkenz.xsrv.jp/open-hinata/#" + z + "/" + lng + "/" + lat + "%3FS%3D1%26L%3D%5B%5B%7B%22id%22%3A%22mw5%22%2C%22ck%22%3Atrue%2C%22o%22%3A1%7D%2C%7B%22id%22%3A2%2C%22ck%22%3Atrue%2C%22o%22%3A1%2C%22c%22%3A%22%22%7D%5D%2C%5B%7B%22id%22%3A2%2C%22ck%22%3Atrue%2C%22o%22%3A1%2C%22c%22%3A%22%22%7D%5D%2C%5B%7B%22id%22%3A2%2C%22ck%22%3Atrue%2C%22o%22%3A1%2C%22c%22%3A%22%22%7D%5D%2C%5B%7B%22id%22%3A2%2C%22ck%22%3Atrue%2C%22o%22%3A1%2C%22c%22%3A%22%22%7D%5D%5D",
      "shi法務局": "https://shi-works.github.io/MojMap/#" +(z-1) + "/" + lat + "/" + lng,
      "shiハザード": "https://shi-works.github.io/hazard-map/#" +(z-1) + "/" + lat + "/" + lng,
      "昔の境界": "https://hanishina.github.io/maps/historymap.html?y=" + lat + "&x=" + lng + "&z=" + z,
      "スーパー地形": "https://www.kashmir3d.com/superdemapp/jump?latlon=" + lat + "," + lng,
    };
    $("#goLink3Button").attr('href', link3Url[selectedLink3]);

    //★変更
    if (!CONFIG.MOBILE) {
    $("#googleLinkButton").attr('href', "https://www.google.com/maps/place/" + lat + "," + lng + "/@" + lat + "," + lng + "," + z + "z");
    $("#streetViewLinkButton").attr('href', "https://www.google.com/maps/@?api=1&map_action=pano&parameters&viewpoint=" + lat + "," + lng);
    $("#mapLibreLinkButton").attr('href', "https://maps.qchizu.xyz/maplibre/#" + (z-1) + "/" + lat + "/" + lng);
    }

    var utmPoint = GSI.UTM.Utils.latlng2PointName(center.lat, center.lng);
    this._utmView.html(utmPoint == '' ? '---' : utmPoint);

    this._zoomView.html(map.getZoom());

    this._contentSizeChange();
  },

  isVisible: function () {
    return (this._container && this._container.is(":visible"));
  },

  setMapLayerList: function (mapLayerList) {
    this._mapLayerList = mapLayerList;

    var mapChangeHandler = L.bind(function () {
      var tileList = this._mapLayerList.getTileList();

      this._seamlessPhotoVisible = false;

      for (var i = 0; i < tileList.length; i++) {
        if (tileList[i]["id"] == "seamlessphoto") {
          this._seamlessPhotoVisible = true;
          break;
        }
      }

      this._refreshSeamlessInfo();

    }, this);
    mapLayerList.on("change", mapChangeHandler);
    mapChangeHandler();

  },

  _onMapMoveStart: function () {

    if (this._addrLoader) this._addrLoader.cancel();
    if (this._elevationLoader) this._elevationLoader.cancel();
    if (this._refreshTimerId) {
      clearTimeout(this._refreshTimerId);
      this._refreshTimerId = null;
    }
    this._clearView();

  },

  _onMapMove: function () {
    this._refreshLatLng();
  },

  _onMapMoveEnd: function () {
    this._refresh();
  },

  _clearView: function () {
    const strNoData = "---";

    this._addrView.html(strNoData);
    this._pref.html(strNoData); //★変更箇所
    this._prefLink1.html(strNoData); //★変更箇所
    this._prefLink1.attr("href",""); //★変更箇所
    this._prefLink2.html(""); //★変更箇所
    this._prefLink2.attr("href",""); //★変更箇所
    this._prefLink3.html(""); //★変更箇所
    this._prefLink3.attr("href",""); //★変更箇所
    this._prefLink4.html(""); //★変更箇所
    this._prefLink4.attr("href",""); //★変更箇所
    this._city.html(strNoData); //★変更箇所
    this._cityLink1.html(strNoData); //★変更箇所
    this._cityLink1.attr("href",""); //★変更箇所
    this._cityLink2.html(""); //★変更箇所
    this._cityLink2.attr("href",""); //★変更箇所
    this._cityLink3.html(""); //★変更箇所
    this._cityLink3.attr("href",""); //★変更箇所
    this._cityLink4.html(""); //★変更箇所
    this._cityLink4.attr("href",""); //★変更箇所
    this._elevationView.html(strNoData);
    this._elevationComment.html("");
    this._seamlessView.html(strNoData);
    this._lakeDepthView.html(strNoData);
    this._lakeBtmHeightView.html(strNoData);
    this._lakeStdHeightView.html(strNoData);

    this._contentSizeChange();
  },

  _refresh: function () {

    if (this._seamlessSpecRequest) {
      this._seamlessSpecRequest.abort();
      this._seamlessSpecRequest = null;
    }
    if (this._addrLoader) this._addrLoader.cancel();
    if (this._elevationLoader) this._elevationLoader.cancel();
    if (this._refreshTimerId) {
      clearTimeout(this._refreshTimerId);
      this._refreshTimerId = null;
    }

    var map = this._mapManager.getMap();
    var center = map.getCenter().wrap();
    var zoom = map.getZoom();
    this._clearView();
    this._refreshTimerId = setTimeout(L.Util.bind(this._execRefresh, this, center, zoom), 800);

  },

  _loadAddr: function(center, z){
    linkZ = z; //★変更箇所（varを付けるとスクロールしてもzoomlevalが変わらなかったため、グローバル変数に変更）
    linkLatLng = center; //★変更箇所
    if (!this._addrLoader) {
      this._addrLoader = new GSI.AddrLoader();
      this._addrLoader.on("load", L.bind(function (e) {
        if (e.title == undefined) return;

        if (this._dispAddrMode == GSI.Footer.DISP_ADDR_YOMI){
        this._setAddressResult(e.titleYomi);
        }
        else{
        this._setAddressResult(e.title);
        }
        this._setPrefResult(e.muniCode,linkLatLng,linkZ); //★変更箇所
      }, this));
    } else {
      this._addrLoader.cancel();
    }

    this._addrLoader.load({ lat: center.lat, lng: center.lng, zoom: z });
  },

  _execRefresh: function (center, zoom) {
    var map = this._mapManager.getMap();

    if (!center) {
      center = map.getCenter().wrap();
      zoom = map.getZoom();
    }
    this._clearView();
    if (this._dispMode == GSI.Footer.DISP_CLOSE) return;

    if (this._dispMode == GSI.Footer.DISP_LARGE) {
      this._loadAddr(center, zoom);
    }

    this._refreshSeamlessInfo(center);

    const loadCondition = {lat: center.lat, lng: center.lng, zoom: zoom};
    if (!this._elevationLoader) {
      this._elevationLoader = new GSI.FooterElevationLoader(map);
      this._elevationLoader.on("load", L.bind(function (e) {
        if (e.h == undefined) return;
        this._setElevationRusult(e.h.toFixed(e.fixed != undefined ? e.fixed : 0) + "m", e.title);
      }, this));
    } else {
      this._elevationLoader.cancel();
    }
    this._elevationLoader.load(loadCondition);

    if ( !this._lakedepthLoader ) {
      this._lakedepthLoader = new GSI.LakeDepthLoader(map);
      this._lakedepthLoader.on("load", L.bind( function(e) {
        if (e.h == undefined) return;
        this._setLakeResult({type: "lakedepth", info: e});
      }, this));
    } else {
      this._lakedepthLoader.cancel();
    }
    
    if ( !this._lakeStdHeightLoader ) {
      this._lakeStdHeightLoader = new GSI.LakeStdHeightLoader(map);
      this._lakeStdHeightLoader.on("load", L.bind( function(e) {
        if (e.h == undefined) return;
        this._setLakeResult({type: "lakestdheight", info: e});
      }, this));
    } else {
      this._lakeStdHeightLoader.cancel();
    }

    if(this._mapManager.lakeDataEnabled()){
      this._lakedepthLoader.load(loadCondition);
      this._lakeStdHeightLoader.load(loadCondition);
    }
  },

  _refreshSeamlessInfo: function (center) {

    if (this._dispMode == GSI.Footer.DISP_MINI && !this._seamlessPhotoVisible) {
      this._elevationContainer.css({
        "display": "table-cell",
        "vertical-align": "middle",
        "height": "34px",
      });
    } else {
      this._elevationContainer.css({
        "display": "block",
        "vertical-align": "middle",
        "height": "auto",
      });
    }

    if (this._seamlessSpecRequest) {
      this._seamlessSpecRequest.abort();
      this._seamlessSpecRequest = null;
    }

    if (!this._seamlessPhotoVisible) {
      this._seamlessContainer.hide();
      this._contentSizeChange();
      return;
    } else {
      this._seamlessContainer.show();
      this._seamlessView.html("---");
      this._contentSizeChange();
    }

    var map = this._mapManager.getMap();

    var zoom = map.getZoom();
    if (zoom < 14 || zoom > 18) {
      return;
    }
    if (!center) {
      center = map.getCenter().wrap();
    }
    zoom = 11;

    var x = this._getTileX(zoom, center.lng);
    var y = this._getTileY(zoom, center.lat);

    var url = "https://maps.gsi.go.jp/xyz/seamlessphoto_spec/" + zoom + "/" + x.n + "/" + y.n + ".geojson";

    this._seamlessSpecRequest = $.ajax({
      type: "GET",
      dataType: "JSON",
      url: url,
      async: false
    })
      .done(L.bind(function (center, data) {
        this._setSeamlessSpecInfo(center, data);
      }, this, center))
      .always(function () {

      });
  },

  _getTileX: function (z, lon) {
    var lng_rad = lon * Math.PI / 180; var R = 128 / Math.PI; var worldCoordX = R * (lng_rad + Math.PI);
    var pixelCoordX = worldCoordX * Math.pow(2, z); var tileCoordX = Math.floor(pixelCoordX / 256);
    return { n: tileCoordX, px: Math.floor(pixelCoordX - tileCoordX * 256) };
  },

  _getTileY: function (z, lat) {
    var lat_rad = lat * Math.PI / 180; var R = 128 / Math.PI; var worldCoordY = - R / 2 * Math.log((1 + Math.sin(lat_rad)) / (1 - Math.sin(lat_rad))) + 128; var pixelCoordY = worldCoordY * Math.pow(2, z); var tileCoordY = Math.floor(pixelCoordY / 256);
    return { n: tileCoordY, px: Math.floor(pixelCoordY - tileCoordY * 256) };
  },

  _inPolygon: function (p, coords) {
    var i, j;
    var count = 0;
    var cp;

    var isCross = function (y, p1, p2) {
      var cp = {};
      if (p1.lat > p2.lat) {
        var p;
        p = p1;
        p1 = p2;
        p2 = p;
      }
      cp.lng = (p1.lng * (p2.lat - y) + p2.lng * (y - p1.lat)) / (p2.lat - p1.lat);
      cp.lat = y;
      if (p1.lat <= y && y < p2.lat)
        return cp;
      else
        return null;
    };

    for (i = 0; i < coords.length; i++) {
      j = (i + 1) % coords.length;
      var p1 = {
        lat: coords[i][1],
        lng: coords[i][0]
      };
      var p2 = {
        lat: coords[j][1],
        lng: coords[j][0]
      };
      cp = isCross(p.lat, p1, p2);

      if (cp) {
        if (cp.lng > p.lng)
          count++;
      }
    }
    return count % 2;
  },

  _setSeamlessSpecInfo: function (center, data) {
    if (!data.features) {
      return;
    }
    for (var i = 0; i < data.features.length; i++) {
      var feature = data.features[i];
      if (!feature.geometry.coordinates) continue;

      var coords = feature.geometry.coordinates[0];

      if (this._inPolygon(center, coords)) {
        this._seamlessView.html(feature.properties["撮影年月"]);
        break;
      }
    }
  },

  _setElevationRusult: function (data, dataSrc) {
    this._elevationView.html(data);
    this._elevationComment.html("（" + "データソース：" + dataSrc + "）");

    this._contentSizeChange();
  },

  _setAddressResult: function (address) {
    this._addrView.html(address ? address : "---");
    this._contentSizeChange();
  },

  _setPrefResult: function(muniCode, latlng, z) {
    console.log('=== Debug: _setPrefResult function start ===');
    console.log('Input params:', { muniCode, latlng, z });
  
    // 市区町村コードから都道府県コードと市区町村コードを抽出
    let muniArray = GSI.MUNI_ARRAY[muniCode].split(",");
    console.log('Muni array:', muniArray);
    let pref = muniArray[1];
    let city = muniArray[3];
    let prefCode = muniArray[0] + '000';
    let cityCode = muniArray[2];
  
    console.log('Normalized codes:', { 
      pref, city, 
      prefCode: prefCode,
      cityCode: cityCode 
    });
  
    // 政令市の処理
    if (city.indexOf('　') !== -1) {
      cityCode = String(cityCode).substr(0, 4) + "0";
      city = city.substr(0, city.indexOf('　'));
      console.log('Designated city processing:', { 
        modifiedCityCode: cityCode, 
        modifiedCity: city 
      });
    }
  
    // 座標変換の計算
    let wmlatlng = GSI.Utils.bl2xy(latlng, 0);
    let arcX = parseInt(wmlatlng.x - 40075017);
    let arcY = parseInt(wmlatlng.y);
    let extent1 = parseInt(wmlatlng.x) - parseInt(15000000 / Math.pow(2, parseInt(z)-1));
    let extent2 = parseInt(wmlatlng.y) - parseInt(30000000 / Math.pow(2, parseInt(z)-1));
    let extent3 = parseInt(wmlatlng.x) + parseInt(15000000 / Math.pow(2, parseInt(z)-1));
    let extent4 = parseInt(wmlatlng.y) + parseInt(30000000 / Math.pow(2, parseInt(z)-1));
  
    // ズームレベル変換テーブル
    let pascoZl = {
      "8":"1000000", "9":"1000000", "10":"500000",
      "11":"200000", "12":"100000", "13":"50000",
      "14":"25000", "15":"25000", "16":"10000",
      "17":"5000", "18":"2500", "19":"1000",
      "20":"500", "21":"500", "22":"500",
      "23":"500", "24":"500"
    };
  
    let kkcZl = Math.floor(491520000 / (2 ** z));
    let ajikoZl = Math.floor(589824000 / (2 ** z));
  
    // 都道府県名を表示
    this._pref.html(pref);

    // CSVファイルの処理を保持データを使用するように変更
    if (this._linksData) {
      console.log('Using cached links data');
      
      // 都道府県のリンク設定
      if (this._linksData[prefCode]) {
          const prefLinks = this._linksData[prefCode].map(link => ({
              html: link.html,
              title: link.title,
              url: link.urlTemplate
                  .replace(/{z}/g, z)
                  .replace(/{lat}/g, latlng.lat)
                  .replace(/{lng}/g, latlng.lng)
                  .replace(/{arcX}/g, arcX)
                  .replace(/{arcY}/g, arcY)
          }));
          this._setPrefLinks(prefLinks);
      } else {
          this._setDefaultPrefLink();
      }

      // 市区町村のリンク設定
      if (this._linksData[cityCode]) {
          const cityLinks = this._linksData[cityCode].map(link => ({
              html: link.html,
              title: link.title,
              url: link.urlTemplate
                  .replace(/{z}/g, z)
                  .replace(/{lat}/g, latlng.lat)
                  .replace(/{lng}/g, latlng.lng)
                  .replace(/{arcX}/g, arcX)
                  .replace(/{arcY}/g, arcY)
          }));
          this._setCityLinks(cityLinks);
      } else {
          this._setDefaultCityLink();
      }
    } else {
        this._setDefaultPrefLink();
        this._setDefaultCityLink();
    }

    this._contentSizeChange();
  
    // 市区町村名を表示
    this._city.html(city ? city + " " : "---");
  },
  
  // 都道府県リンクの設定
  _setPrefLinks: function(links) {
    for (let i = 0; i < Math.min(links.length, 4); i++) {
        const linkNum = i + 1;
        const linkElement = this[`_prefLink${linkNum}`];
        
        if (linkElement) {
            linkElement.html(links[i].html);  // theme_nameを表示
            linkElement.attr({
                "href": links[i].url,
                "title": links[i].title  // site_name + " " + layer_name
            });
            linkElement.css("color", "");
        }
    }
  },

  // 市区町村リンクの設定も同様に修正
  _setCityLinks: function(links) {
    for (let i = 0; i < Math.min(links.length, 4); i++) {
        const linkNum = i + 1;
        const linkElement = this[`_cityLink${linkNum}`];
        
        if (linkElement) {
            linkElement.html(links[i].html);  // theme_nameを表示
            linkElement.attr({
                "href": links[i].url,
                "title": links[i].title  // site_name + " " + layer_name
            });
            linkElement.css("color", "");
        }
    }
  },
  
  // デフォルトの都道府県リンク設定
  _setDefaultPrefLink: function() {
    console.log('Setting default prefecture link');
    this._prefLink1.html("リンク未整備");
    this._prefLink1.attr({
      "href": "https://info.qchizu.xyz/qchizu/improve/",
      "title": "リンク整備に御協力いただける方はこちら"
    });
    this._prefLink1.css("color", "");
  },
  
  // デフォルトの市区町村リンク設定
  _setDefaultCityLink: function() {
    console.log('Setting default city link');
    this._cityLink1.html("リンク未整備");
    this._cityLink1.attr({
      "href": "https://info.qchizu.xyz/qchizu/improve/",
      "title": "リンク整備に御協力いただける方は、クリックしてください。"
    });
    this._cityLink1.css("color", "");
  },

  updateLakeDepthVisible: function(enabled){
    this._mapManager.enableLakeData(enabled);
    this._lakeDepthEnabled = enabled;
    this._lakeDepthContainer.css("display", this._dispMode == GSI.Footer.DISP_LARGE && enabled ? "block":"none");
  },

  _setLakeResult: function (params) {
    if(!params || !params.type || !params.info) return;
    var curType = params.type;
    var curInfo = params.info;

    let strH = '---';
    if(curType == "lakedepth"){
      this._lakeDepthFix = curInfo.fixed !== undefined ? curInfo.fixed:0;
      this._lakeDepth = curInfo.h !== undefined ? curInfo.h.toFixed(this._lakeDepthFix) : undefined;
      if(this._lakeDepth !== undefined) strH = this._lakeDepth+'m';
      this._lakeDepthView.html(strH);
    } else if(curType == "lakestdheight"){
      this._lakeStdHeightFix = curInfo.fixed !== undefined ? curInfo.fixed:0;
      this._lakeStdHeight = curInfo.h !== undefined ? curInfo.h.toFixed(curInfo.fixed !== undefined?curInfo.fixed:0) : undefined;
      if(this._lakeStdHeight !== undefined) strH = this._lakeStdHeight+'m';
      this._lakeStdHeightView.html(strH);
    }

    strH = '---';
    if(this._lakeDepth !== undefined && this._lakeStdHeight !== undefined){
      try{
        let fix = Math.max(this._lakeDepthFix, this._lakeStdHeightFix);
        let fLakeBtmHeight = (parseFloat(this._lakeStdHeight) - parseFloat(this._lakeDepth)).toFixed(fix);
        strH = fLakeBtmHeight + 'm';
      } catch {}
    }
    this._lakeBtmHeightView.html(strH);

    this._contentSizeChange();
  }
});

GSI.Footer.DISP_LARGE = 2;
GSI.Footer.DISP_MINI = 1;
GSI.Footer.DISP_CLOSE = 0;

GSI.Footer.DISP_ADDR_KANJI=0;
GSI.Footer.DISP_ADDR_YOMI=1;