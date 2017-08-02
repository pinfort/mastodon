# frozen_string_literal: true

module SettingsHelper
  HUMAN_LOCALES = {
    en: 'English',
    ar: 'اٹربية',
    bg: 'БългарѺи',
    ca: 'Catal�',
    de: 'Deutsch',
    eo: 'Esperanto',
    es: 'Español',
    fa: '٧رس�,
    fi: 'Suomi',
    fr: 'Français',
    he: 'עברית',
    hr: 'Hrvatski',
    hu: 'Magyar',
    id: 'Bahasa Indonesia',
    io: 'Ido',
    it: 'Italiano',
    ja: '日本��,
    ko: '한국어',
    nl: 'Nederlands',
    no: 'Norsk',
    oc: 'Occitan',
    pl: 'Polszczyzna',
    pt: 'Português',
    'pt-BR': 'Português do Brasil',
    ru: '�уѺий',
    th: '��าษา๸�ย',
    tr: 'Türkçe',
    uk: 'Українька',
    'zh-CN': '简体中��,
    'zh-HK': '繫�中於�香港,
    'zh-TW': '繫�中於��灣,
  }.freeze

  def human_locale(locale)
    HUMAN_LOCALES[locale]
  end

  def hash_to_object(hash)
    HashObject.new(hash)
  end

  def session_device_icon(session)
    device = session.detection.device

    if device.mobile?
      'mobile'
    elsif device.tablet?
      'tablet'
    else
      'desktop'
    end
  end
end
