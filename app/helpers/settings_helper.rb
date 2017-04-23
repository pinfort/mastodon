# frozen_string_literal: true

module SettingsHelper
  HUMAN_LOCALES = {
    en: 'English',
    de: 'Deutsch',
    es: 'Español',
    eo: 'Esperanto',
    fr: 'Français',
    hr: 'Hrvatski',
    hu: 'Magyar',
    io: 'Ido',
    it: 'Italiano',
    nl: 'Nederlands',
    no: 'Norsk',
    oc: 'Occitan',
    pl: 'Polszczyzna',
    pt: 'Português',
    'pt-BR': 'Português do Brasil',
    fi: 'Suomi',
    ru: '�уѺий',
    uk: 'Українька',
    ja: '日本�,
    'zh-CN': '简体中�,
    'zh-HK': '繫�中於�香港,
    'zh-TW': '繫�中於��灣,
    bg: 'БългарѺи',
    id: 'Bahasa Indonesia',
  }.freeze

  def human_locale(locale)
    HUMAN_LOCALES[locale]
  end

  def hash_to_object(hash)
    HashObject.new(hash)
  end
end
