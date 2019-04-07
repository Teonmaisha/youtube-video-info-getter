(() => {

	let windowNew; // Note: Edge 対策

	/**
	 * 
	 */
	const main = () => {

		openWindow(win => {
			windowNew = win; // Note: Edge 対策
			renderHead(win.document.head);
			renderBody(win.document.body);
		});

	};

	/**
	 * 
	 */
	const renderHead = head => {
		head.innerHTML = `<title>YouTube 動画情報</title>
<style>
/* 見出し */
h3 {
	padding: .25em 0 .5em .75em;
	border-left: 6px solid #ccc;
	border-bottom: 1px solid #ccc;
}

h4 {
	padding: .5em .75em;
	background-color: #f6f6f6;
}

.title {
	margin-right: 10px;
}

.length {
	font-weight: normal;
	color: #A0A0A0;
}

/* テーブル */
table {
	border-collapse: collapse;
}

table tr {
	border: solid 2px #666;
}

table tr:first-child {
	border-style: none;
}

table tr:first-child * {
	border-style: none;
}

table td {
	padding: 1px 10px;
}

table td, table th {
	border: 1px #aaa solid;
}
</style>`;
	};

	/**
	 * 
	 */
	const renderBody = body => {

		body.insertAdjacentHTML('beforeend', '<h3>基本情報</h3>');
		renderBasicInfo(body);
		body.insertAdjacentHTML('beforeend', '<h3>フォーマット情報</h3>');
		renderFmtsInfo(body);

	};

	/**
	 * 
	 */
	const renderBasicInfo = body => {

		const args = window.ytplayer.config.args;

		const thumbnail_url = args.thumbnail_url;
		const title = args.title;

		const s_raw = args.length_seconds;
		const s = s_raw % 60;
		const m_raw = (s_raw - s) / 60;
		const m = m_raw % 60;
		const h = (m_raw - m) / 60;

		const h_str = ((h !== 0) ? h + ':' : '');
		const m_str = ('' + m).padStart(2, '0') + ':';
		const s_str = ('' + s).padStart(2, '0');

		const length_str = h_str + m_str + s_str;

		body.insertAdjacentHTML('beforeend', '<h4><span class="title">' + title + '</span><span class="length">' + length_str + '</span></h4>');
		body.insertAdjacentHTML('beforeend', '<img src="' + thumbnail_url + '">');

	};

	/**
	 * 
	 */
	const renderFmtsInfo = body => {

		const args = window.ytplayer.config.args;

		const fmt_stream_map = args.url_encoded_fmt_stream_map.split(',').map(parseQuery);
		const fmt_list = args.fmt_list.split(',').map(parseFmt);
		const adaptive_fmts = args.adaptive_fmts.split(',').map(parseQuery);

		fmt_stream_map.forEach(fmt => { fmt.size = fmt_list.find(f => f.itag === fmt.itag).size; });

		body.insertAdjacentHTML('beforeend', '<h4>旧方式 (映像＋音声)</h4>');
		body.appendChild(createTableElementOfFmts(fmt_stream_map));
		body.insertAdjacentHTML('beforeend', '<h4>新方式 (映像または音声)</h4>');
		body.appendChild(createTableElementOfFmts(adaptive_fmts));

	};

	/**
	 * 
	 */
	const createTableElementOfFmts = fmts => {

		const table = [['形式', 'サイズ', 'リンク', 'コンテナ', 'コーデック', 'itag']];

		fmts.forEach(fmt => {

			const mime = parseMime(fmt.type);

			const type = mime.type;
			const size = fmt.size || '';
			const subtype = mime.subtype;
			const codecs = mime.parameter.codecs;
			const itag = fmt.itag;

			const link = windowNew.document.createElement('a'); // Note: Edge 対策
			link.href = fmt.url;
			link.textContent = 'リンク';

			table.push([type, size, link, subtype, codecs, itag]);

		});

		return createTableElement(table, true);

	};

	/**
	 * 
	 */
	const parseQuery = query => {
		const object = {};
		const params = new URLSearchParams(query);
		params.forEach((value, key) => { object[key] = value; });
		return object;
	};

	/**
	 * 
	 */
	const parseFmt = fmt => {
		const [itag, size] = fmt.split('/', 2);
		return {itag, size};
	};

	/**
	 * 
	 */
	const parseMime = mime => {
		const [types, ...params] = mime.split(';').map(s => s.trim());
		const [type, subtype] = types.split('/', 2).map(s => s.trim());
		const parameter = {};
		params.map(param => param.split('=', 2).map(s => s.trim())).forEach(([key, value]) => { parameter[key] = value.replace(/^\"|\"$/g, ''); });
		return {type, subtype, parameter};
	};

	/**
	 * 
	 */
	const createTableElement = (table, headers) => {

		const tableElement = windowNew.document.createElement('table'); // Note: Edge 対策

		table.forEach(row => {
			const rowElement = tableElement.insertRow();
			row.forEach(cell => {
				if ( headers ) {
					const thElement = windowNew.document.createElement('th'); // Note: Edge 対策
					thElement.textContent = cell;
					rowElement.appendChild(thElement);
				} else {
					if ( cell instanceof windowNew.HTMLElement ) { // Note: Edge 対策
						rowElement.insertCell().appendChild(cell);
					} else {
						rowElement.insertCell().textContent = cell;
					}
				}
			});
			headers = false;
		});

		return tableElement;

	};

	/**
	 * 
	 */
	const openWindow = callback => {
		const win = window.open();
		win.document.documentElement.innerHTML = '<!DOCTYPE html><html><head></head><body></body></html>';
		callback(win);
	};

	// 
	main();

})();
