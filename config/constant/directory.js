'use strict';

const EGG_APP = 'app';
const EGG_CONTROLLER = `${EGG_APP}/controller`;
const EGG_EXTEND = `${EGG_APP}/extend`;
const EGG_MIDDLEWARE = `${EGG_APP}/middleware`;
const EGG_MODEL = `${EGG_APP}/model`;
const EGG_SERVICE = `${EGG_APP}/service`;
const JSCMS_THEME = `${EGG_APP}/theme`;
const JSCMS_MODELMAN = `${EGG_MODEL}/proto`;
const JSCMS_STATIC = `${EGG_APP}/static`;
const JSCMS_MANAGEMENT = `${JSCMS_STATIC}/management`;
const JSCMS_UPLOAD = `${JSCMS_STATIC}/upload`;
const JSCMS_URL_STATIC = `/static`;
const JSCMS_URL_UPLOAD = `${JSCMS_URL_STATIC}/upload`;
const JSCMS_URL_MANAGEMENT = `/m`;
const JSCMS_URL_THEME_STATIC = `/theme-static`;

module.exports = {
  EGG_APP,
  EGG_CONTROLLER,
  EGG_EXTEND,
  EGG_MIDDLEWARE,
  EGG_MODEL,
  EGG_SERVICE,
  JSCMS_MANAGEMENT,
  JSCMS_MODELMAN,
  JSCMS_STATIC,
  JSCMS_UPLOAD,
  JSCMS_THEME,
  JSCMS_URL_STATIC,
  JSCMS_URL_UPLOAD,
  JSCMS_URL_MANAGEMENT,
  JSCMS_URL_THEME_STATIC
}
