"use client";

import { MODEL_OPTIONS, useSettings } from "./providers/SettingsProvider";
import type { SettingsType } from "./providers/SettingsProvider";
import { useState, useEffect } from "react";
import {
  Switch,
  Select,
  SelectItem,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Button,
  ScrollShadow,
} from "@nextui-org/react";
import {
  IoSettingsOutline,
  IoCloseOutline,
  IoSunnyOutline,
  IoMoonOutline,
  IoDesktopOutline,
  IoLanguageOutline,
} from "react-icons/io5";
import { useTheme } from "next-themes";
import ChessPiece from "./ChessPiece";
import { useLanguage } from "../i18n/LanguageProvider";
import { Language, translations } from "../i18n/translations";

export default function Settings() {
  const { settings, setSettings } = useSettings();
  const { theme, setTheme } = useTheme();
  const { t, language, setLanguage, mounted: languageMounted } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !languageMounted) {
    return null;
  }

  return (
    <>
      {/* Settings Button */}
      <Button
        isIconOnly
        variant="light"
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed top-4 right-4 z-50 ${
          isOpen ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
        aria-label="Settings"
      >
        <IoSettingsOutline className="w-5 h-5" />
      </Button>

      {/* Settings Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[400px] transform transition-transform duration-300 ease-in-out z-40 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <Card className="h-full rounded-none sm:rounded-l-2xl flex flex-col">
          <CardHeader className="flex justify-between items-center px-6 py-4 shrink-0">
            <h2 className="text-xl font-bold">{t("settings.title")}</h2>
            <Button
              isIconOnly
              variant="light"
              onClick={() => setIsOpen(false)}
              size="sm"
            >
              <IoCloseOutline className="w-5 h-5" />
            </Button>
          </CardHeader>
          <Divider className="shrink-0" />
          <ScrollShadow className="flex-grow overflow-auto">
            <CardBody className="gap-6 p-6">
              <div className="space-y-8">
                {/* AI Settings Group */}
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-default-600 px-1">
                    {t("settings.aiSettings.title")}
                  </h3>

                  {/* AI Toggle */}
                  <div className="flex justify-between items-center px-1 py-2">
                    <span className="text-sm font-medium">
                      {t("settings.aiSettings.playWithAI")}
                    </span>
                    <Switch
                      isSelected={settings.aiMode}
                      onValueChange={(checked) =>
                        setSettings({
                          ...settings,
                          aiMode: checked,
                        })
                      }
                      size="lg"
                      color="primary"
                      classNames={{
                        wrapper: "group-data-[selected=true]:bg-primary",
                      }}
                    />
                  </div>

                  {/* AI Model Select */}
                  <div className="space-y-2 px-1">
                    <label className="text-sm font-medium block text-default-700">
                      {t("settings.aiSettings.aiModel")}
                    </label>
                    <Select
                      selectedKeys={[settings.model]}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          model: e.target.value as SettingsType["model"],
                        })
                      }
                      className="w-full"
                      isDisabled={!settings.aiMode}
                      size="sm"
                      variant="flat"
                    >
                      {MODEL_OPTIONS.map((model) => (
                        <SelectItem key={model} value={model}>
                          {model}
                        </SelectItem>
                      ))}
                    </Select>
                  </div>
                </div>

                {/* Display Settings Group */}
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-default-600 px-1">
                    {t("settings.displaySettings.title")}
                  </h3>

                  {/* Language Select */}
                  <div className="space-y-2 px-1">
                    <label className="text-sm font-medium block text-default-700">
                      {t("settings.displaySettings.language")}
                    </label>
                    <Select
                      selectedKeys={[language]}
                      onChange={(e) => setLanguage(e.target.value as Language)}
                      className="w-full"
                      size="sm"
                      variant="flat"
                      startContent={<IoLanguageOutline className="text-default-500" />}
                    >
                      {Object.keys(translations).map((lang) => (
                        <SelectItem 
                          key={lang} 
                          value={lang}
                        >
                          {t(`settings.displaySettings.languages.${lang}`)}
                        </SelectItem>
                      ))}
                    </Select>
                  </div>

                  {/* Theme Select */}
                  <div className="space-y-2 px-1">
                    <label className="text-sm font-medium block text-default-700">
                      {t("settings.displaySettings.theme")}
                    </label>
                    <Select
                      selectedKeys={[theme ?? 'system']}
                      onChange={(e) => setTheme(e.target.value)}
                      className="w-full"
                      size="sm"
                      variant="flat"
                      startContent={
                        theme === 'dark' ? (
                          <IoMoonOutline className="text-default-500" />
                        ) : theme === 'light' ? (
                          <IoSunnyOutline className="text-default-500" />
                        ) : (
                          <IoDesktopOutline className="text-default-500" />
                        )
                      }
                    >
                      <SelectItem key="light" value="light" startContent={<IoSunnyOutline />}>
                        {t("settings.displaySettings.themeOptions.light")}
                      </SelectItem>
                      <SelectItem key="dark" value="dark" startContent={<IoMoonOutline />}>
                        {t("settings.displaySettings.themeOptions.dark")}
                      </SelectItem>
                      <SelectItem key="system" value="system" startContent={<IoDesktopOutline />}>
                        {t("settings.displaySettings.themeOptions.system")}
                      </SelectItem>
                    </Select>
                  </div>

                  {/* Piece Style Toggle */}
                  <div className="flex justify-between items-center px-1 py-2">
                    <span className="text-sm font-medium">
                      {t("settings.displaySettings.pieceStyle")}
                    </span>
                    <Switch
                      isSelected={settings.useIcons}
                      onValueChange={(checked) =>
                        setSettings({
                          ...settings,
                          useIcons: checked,
                        })
                      }
                      size="lg"
                      color="primary"
                      startContent={
                        <div className="flex items-center justify-center w-5 h-5 text-base">
                          <ChessPiece
                            className="w-5 h-5"
                            piece="k"
                            showType="Icon"
                          />
                        </div>
                      }
                      endContent={
                        <div className="flex items-center justify-center w-5 h-5 text-base">
                          <ChessPiece
                            className="w-5 h-5"
                            piece="k"
                            showType="Character"
                          />
                        </div>
                      }
                      classNames={{
                        wrapper: "group-data-[selected=true]:bg-primary",
                      }}
                    />
                  </div>
                </div>
              </div>
            </CardBody>
          </ScrollShadow>
        </Card>
      </div>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
