import type { Tool } from "@/lib/tools";
import { AgeCalculator } from "./calculators/AgeCalculator";
import { PercentageCalculator } from "./calculators/PercentageCalculator";
import { Stopwatch } from "./calculators/Stopwatch";
import { Timer } from "./calculators/Timer";
import { UnitConverter } from "./calculators/UnitConverter";
import { VatCalculator } from "./calculators/VatCalculator";
import { APAGenerator } from "./generators/APAGenerator";
import { HashtagGenerator } from "./generators/HashtagGenerator";
import { PasswordGenerator } from "./generators/PasswordGenerator";
import { QRGenerator } from "./generators/QRGenerator";
import { TextSummary } from "./text/TextSummary";
import { CaseConverter } from "./text/CaseConverter";
import { WordCounter } from "./text/WordCounter";
import { UploadPlaceholder } from "./UploadPlaceholder";

export function ToolRenderer({ tool }: { tool: Tool }) {
  switch (tool.kind) {
    case "word-counter":
      return <WordCounter />;
    case "case-converter":
      return <CaseConverter />;
    case "percentage":
      return <PercentageCalculator />;
    case "vat":
      return <VatCalculator />;
    case "age":
      return <AgeCalculator />;
    case "password":
      return <PasswordGenerator />;
    case "unit-converter":
      return <UnitConverter />;
    case "timer":
      return <Timer />;
    case "stopwatch":
      return <Stopwatch />;
    case "qr":
      return <QRGenerator />;
    case "apa":
      return <APAGenerator />;
    case "summary":
      return <TextSummary />;
    case "hashtags":
      return <HashtagGenerator />;
    default:
      return <UploadPlaceholder tool={tool} />;
  }
}
