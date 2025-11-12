import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { RotateCcw } from "lucide-react";
import { useTranslation } from "react-i18next";

// Example props for context
interface PreviewSettingsProps {
  config: any;
  updateConfig: (key: string, value: any) => void;
  resetField: (key: string) => void;
  showGuide: boolean;
  toggleGuide: (value: boolean) => void;
}

const PreviewSettings: React.FC<PreviewSettingsProps> = ({
  config,
  updateConfig,
  resetField,
  showGuide,
  toggleGuide
}) => {
  const { t } = useTranslation();

  return (
    <Card className="bg-neutral-900/70 border-neutral-800 text-gray-100">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-semibold">{t("previewSettings.title")}</CardTitle>

        {/* Overlay toggle section */}
        <div className="flex items-center space-x-2">
          <span className="text-xs text-gray-400">{t("previewSettings.overlayGuide")}</span>
          <Switch checked={showGuide} onCheckedChange={toggleGuide} />
        </div>
      </CardHeader>

      <CardContent className="space-y-3 text-sm">
        {/* URL field */}
        <div className="flex items-center justify-between space-x-2">
          <label className="w-28 text-gray-400">{t("previewSettings.url")}</label>
          <Input
            value={config.url || ""}
            onChange={(e) => updateConfig("url", e.target.value)}
            className="flex-1 text-xs bg-neutral-800 border-neutral-700"
          />
          <Button variant="ghost" size="icon" onClick={() => resetField("url")}>
            <RotateCcw className="w-4 h-4 text-gray-400 hover:text-gray-200" />
          </Button>
        </div>

        {/* Offset X */}
        <div className="flex items-center justify-between space-x-2">
          <label className="w-28 text-gray-400">{t("previewSettings.offsetX")}</label>
          <Input
            type="number"
            value={config.offsetX || 0}
            onChange={(e) => updateConfig("offsetX", Number(e.target.value))}
            className="flex-1 text-xs bg-neutral-800 border-neutral-700"
          />
          <Button variant="ghost" size="icon" onClick={() => resetField("offsetX")}>
            <RotateCcw className="w-4 h-4 text-gray-400 hover:text-gray-200" />
          </Button>
        </div>

        {/* Offset Y */}
        <div className="flex items-center justify-between space-x-2">
          <label className="w-28 text-gray-400">{t("previewSettings.offsetY")}</label>
          <Input
            type="number"
            value={config.offsetY || 0}
            onChange={(e) => updateConfig("offsetY", Number(e.target.value))}
            className="flex-1 text-xs bg-neutral-800 border-neutral-700"
          />
          <Button variant="ghost" size="icon" onClick={() => resetField("offsetY")}>
            <RotateCcw className="w-4 h-4 text-gray-400 hover:text-gray-200" />
          </Button>
        </div>

        {/* Scale */}
        <div className="flex items-center justify-between space-x-2">
          <label className="w-28 text-gray-400">{t("previewSettings.scale")}</label>
          <Input
            type="number"
            step="0.1"
            value={config.scale || 1}
            onChange={(e) => updateConfig("scale", Number(e.target.value))}
            className="flex-1 text-xs bg-neutral-800 border-neutral-700"
          />
          <Button variant="ghost" size="icon" onClick={() => resetField("scale")}>
            <RotateCcw className="w-4 h-4 text-gray-400 hover:text-gray-200" />
          </Button>
        </div>

        {/* Fit buttons */}
        <div className="flex items-center justify-between space-x-2">
          <label className="w-28 text-gray-400">{t("previewSettings.fit")}</label>
          <div className="flex flex-1 items-center space-x-1 justify-start">
            {["contain", "cover", "fill"].map((mode) => (
              <Button
                key={mode}
                variant={config.fit === mode ? "secondary" : "ghost"}
                size="sm"
                onClick={() => updateConfig("fit", mode)}
              >
                {t(`previewSettings.fitModes.${mode}`)}
              </Button>
            ))}
          </div>
          <Button variant="ghost" size="icon" onClick={() => resetField("fit")}>
            <RotateCcw className="w-4 h-4 text-gray-400 hover:text-gray-200" />
          </Button>
        </div>

        {/* Align dropdown */}
        <div className="flex items-center justify-between space-x-2">
          <label className="w-28 text-gray-400">{t("previewSettings.align")}</label>
          <Select value={config.align} onValueChange={(v) => updateConfig("align", v)}>
            <SelectTrigger className="w-40 bg-neutral-800 border-neutral-700 text-xs">
              <SelectValue placeholder={t("previewSettings.alignSelect")} />
            </SelectTrigger>
            <SelectContent>
              {["center", "bottom", "top", "left", "right"].map((opt) => (
                <SelectItem key={opt} value={opt}>
                  {t(`previewSettings.alignModes.${opt}`)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="ghost" size="icon" onClick={() => resetField("align")}>
            <RotateCcw className="w-4 h-4 text-gray-400 hover:text-gray-200" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PreviewSettings;
