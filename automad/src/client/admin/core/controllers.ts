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

export const enum AppController {
	bootstrap = 'AppController::bootstrap',
	getServerInfo = 'AppController::getServerInfo',
	updateState = 'AppController::updateState',
}

export const enum CacheController {
	clear = 'CacheController::clear',
	purge = 'CacheController::purge',
}

export const enum ConfigController {
	update = 'ConfigController::update',
}

export const enum FileCollectionController {
	list = 'FileCollectionController::list',
	upload = 'FileCollectionController::upload',
}

export const enum FileController {
	editInfo = 'FileController::editInfo',
	import = 'FileController::import',
}

export const enum HistoryController {
	log = 'HistoryController::log',
	restore = 'HistoryController::restore',
}

export const enum ImageCollectionController {
	list = 'ImageCollectionController::list',
}

export const enum ImageController {
	save = 'ImageController::save',
}

export const enum MailConfigController {
	save = 'MailConfigController::save',
	reset = 'MailConfigController::reset',
	test = 'MailConfigController::test',
}

export const enum PackageManagerController {
	getOutdated = 'PackageManagerController::getOutdated',
	getPackageCollection = 'PackageManagerController::getPackageCollection',
	install = 'PackageManagerController::install',
	remove = 'PackageManagerController::remove',
	update = 'PackageManagerController::update',
	updateAll = 'PackageManagerController::updateAll',
}

export const enum PageController {
	add = 'PageController::add',
	breadcrumbs = 'PageController::breadcrumbs',
	data = 'PageController::data',
	delete = 'PageController::delete',
	duplicate = 'PageController::duplicate',
	move = 'PageController::move',
	updateIndex = 'PageController::updateIndex',
}

export const enum PageCollectionController {
	getRecentlyEdited = 'PageCollectionController::getRecentlyEdited',
}

export const enum PageTrashController {
	clear = 'PageTrashController::clear',
	list = 'PageTrashController::list',
	permanentlyDelete = 'PageTrashController::permanentlyDelete',
	restore = 'PageTrashController::restore',
}

export const enum SearchController {
	searchReplace = 'SearchController::searchReplace',
}

export const enum SessionController {
	login = 'SessionController::login',
	logout = 'SessionController::logout',
	validate = 'SessionController::validate',
}

export const enum SharedController {
	data = 'SharedController::data',
}

export const enum SystemController {
	checkForUpdate = 'SystemController::checkForUpdate',
	update = 'SystemController::update',
}

export const enum UserCollectionController {
	createUser = 'UserCollectionController::createUser',
	edit = 'UserCollectionController::edit',
	inviteUser = 'UserCollectionController::inviteUser',
}

export const enum UserController {
	changePassword = 'UserController::changePassword',
	edit = 'UserController::edit',
	resetPassword = 'UserController::resetPassword',
}
