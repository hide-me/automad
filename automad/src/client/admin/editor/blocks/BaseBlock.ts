/*
 *                    ....
 *                  .:   '':.
 *                  ::::     ':..
 *                  ::.         ''..
 *       .:'.. ..':.:::'    . :.   '':.
 *      :.   ''     ''     '. ::::.. ..:
 *      ::::.        ..':.. .''':::::  .
 *      :::::::..    '..::::  :. ::::  :
 *      ::'':::::::.    ':::.'':.::::  :
 *      :..   ''::::::....':     ''::  :
 *      :::::.    ':::::   :     .. '' .
 *   .''::::::::... ':::.''   ..''  :.''''.
 *   :..:::'':::::  :::::...:''        :..:
 *   ::::::. '::::  ::::::::  ..::        .
 *   ::::::::.::::  ::::::::  :'':.::   .''
 *   ::: '::::::::.' '':::::  :.' '':  :
 *   :::   :::::::::..' ::::  ::...'   .
 *   :::  .::::::::::   ::::  ::::  .:'
 *    '::'  '':::::::   ::::  : ::  :
 *              '::::   ::::  :''  .:
 *               ::::   ::::    ..''
 *               :::: ..:::: .:''
 *                 ''''  '''''
 *
 *
 * AUTOMAD
 *
 * Copyright (c) 2023 by Marc Anton Dahmen
 * https://marcdahmen.de
 *
 * Licensed under the MIT license.
 */

import {
	API,
	BlockAPI,
	BlockTool,
	BlockToolConstructorOptions,
	BlockToolData,
} from '@editorjs/editorjs';
import { create } from '@/core';
import { KeyValueMap } from '@/types';

/**
 * The abstract base block class.
 */
export abstract class BaseBlock<DataType extends object> implements BlockTool {
	/**
	 * The editor API.
	 */
	protected api: API;

	/**
	 * The tool's data.
	 */
	protected data: DataType;

	/**
	 * The tool configuration.
	 */
	protected config: KeyValueMap;

	/**
	 * The block API.
	 */
	protected blockAPI: BlockAPI;

	/**
	 * The wrapper element.
	 */
	protected wrapper: HTMLElement;

	/**
	 * The constructor.
	 *
	 * @param options
	 * @param options.data
	 * @param options.api
	 * @param options.config
	 * @param options.block
	 */
	constructor({ data, api, config, block }: BlockToolConstructorOptions) {
		this.api = api;
		this.data = this.prepareData(data || ({} as DataType));
		this.config = config;
		this.blockAPI = block;
		this.wrapper = create('div');
	}

	/**
	 * Prepare the data that is passed to the constructor.
	 *
	 * @param data
	 * @return the prepared data
	 */
	protected prepareData(data: DataType): DataType {
		return data;
	}

	/**
	 * Render the block.
	 *
	 * @return the rendered element
	 */
	abstract render(): HTMLElement;

	/**
	 * Save the block data.
	 *
	 * @return the saved data
	 */
	abstract save(): BlockToolData<DataType>;
}