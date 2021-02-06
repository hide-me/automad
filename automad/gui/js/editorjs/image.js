/*
 *	                  ....
 *	                .:   '':.
 *	                ::::     ':..
 *	                ::.         ''..
 *	     .:'.. ..':.:::'    . :.   '':.
 *	    :.   ''     ''     '. ::::.. ..:
 *	    ::::.        ..':.. .''':::::  .
 *	    :::::::..    '..::::  :. ::::  :
 *	    ::'':::::::.    ':::.'':.::::  :
 *	    :..   ''::::::....':     ''::  :
 *	    :::::.    ':::::   :     .. '' .
 *	 .''::::::::... ':::.''   ..''  :.''''.
 *	 :..:::'':::::  :::::...:''        :..:
 *	 ::::::. '::::  ::::::::  ..::        .
 *	 ::::::::.::::  ::::::::  :'':.::   .''
 *	 ::: '::::::::.' '':::::  :.' '':  :
 *	 :::   :::::::::..' ::::  ::...'   .
 *	 :::  .::::::::::   ::::  ::::  .:'
 *	  '::'  '':::::::   ::::  : ::  :
 *	            '::::   ::::  :''  .:
 *	             ::::   ::::    ..''
 *	             :::: ..:::: .:''
 *	               ''''  '''''
 *
 *
 *	AUTOMAD
 *
 *	Copyright (c) 2020-2021 by Marc Anton Dahmen
 *	https://marcdahmen.de
 *
 *	Licensed under the MIT license.
 *	https://automad.org/license
 */


class AutomadBlockImage {

	static get isReadOnlySupported() {
		return true;
	}

	static get pasteConfig() {
		return {
			patterns: {
				image: /(https?:\/\/)?\S+\.(gif|jpe?g|tiff|png)$/i
			}
		}
	}

	static get toolbox() {
		return {
			title: 'Image',
			icon: '<svg width="18px" height="15px" viewBox="0 0 18 15"><path d="M18,4c0-2.209-1.791-4-4-4H4C1.791,0,0,1.791,0,4v7c0,2.209,1.791,4,4,4h10c2.209,0,4-1.791,4-4V4z M4,2h10 c1.103,0,2,0.897,2,2v3.636l-1.279-1.33C14.534,6.113,14.278,6.002,14.01,6c-0.287-0.012-0.527,0.103-0.717,0.293l-2.302,2.302 L6.573,4.284c-0.389-0.379-1.008-0.379-1.396,0L2,7.383V4C2,2.897,2.897,2,4,2z M14,13H4c-1.103,0-2-0.897-2-2v-0.822l3.875-3.781 l4.427,4.319C10.496,10.905,10.748,11,11,11c0.256,0,0.512-0.098,0.707-0.293l2.279-2.279L16,10.521V11C16,12.103,15.103,13,14,13z" /></svg>'
		};
	}

	constructor({data, api}) {

		this.api = api;

		this.data = {
			url: data.url || '',
			caption: data.caption || ''
		};

		this.settings = Automad.blockEditor.renderLayoutSettings(this.data, data, api, true);
		
		this.wrapper = document.createElement('div');
		this.wrapper.classList.add('cdx-block');
		this.img = document.createElement('img');
		this.caption = Automad.util.create.editable(['cdx-input'], 'Enter a caption', this.data.caption);

		this.wrapper.appendChild(this.img);
		this.wrapper.appendChild(this.caption);

		this.button = document.createElement('div');
		this.button.innerHTML = '<i class="uk-icon-image uk-icon-small"></i>&nbsp;&nbsp;Select Image';
		this.button.classList.add('uk-panel', 'uk-panel-box', 'uk-text-muted', 'uk-text-center');

		var block = this;

		this.button.addEventListener('click', function () {
			block.select();
		});

	}

	insertImage(url) {

		if (url) {
			this.img.src = Automad.util.resolvePath(url);
			this.data.url = url;
			this.button.parentNode.replaceChild(this.wrapper, this.button);
		}

	}

	select() {

		var block = this;

		Automad.selectImage.dialog(false, true, function(url) {
			block.insertImage(url);
		});

	}

	appendCallback() {

		this.select();

	}

	render() {

		if (this.data && this.data.url) {
			this.img.src = Automad.util.resolvePath(this.data.url);
			return this.wrapper;
		} else {
			return this.button;
		}

	}

	save() {

		return Object.assign(this.data, {
			url: this.data.url,
			caption: this.caption.innerHTML
		});

	}

	onPaste(event) {

		if (event.type == 'pattern') {
			this.insertImage(event.detail.data);
		}

	}

	renderSettings() {

		return this.settings;

	}

}