import { FileBlockProps, getLanguageFromFilename } from "@githubnext/utils";
import "./index.css";
import yaml from "js-yaml";

export default function (props: FileBlockProps) {
  const { context, content, metadata, onUpdateMetadata } = props;
  const doc: any = yaml.load(content);
  console.log(doc);
  const language = Boolean(context.path)
    ? getLanguageFromFilename(context.path)
    : "N/A";

  return (
    <div className="Box m-4">
      <div className="Box-header">
        <h3 className="Box-title">
          File: {context.path} {language}
        </h3>
      </div>
      <div className="Box-body">
        <h2>Config</h2>

        <h3>Providers</h3>
        <br />

        <ul>
          {doc.map((provider: any) => (
            <li key={provider.with.virtualMachineScaleSetId}>
              <h4>{provider.provider}</h4>
              <ul>
                {provider.scale.map((scale: any, idx: number) => (
                  <ul key={idx}>
                    <li>- Min: {scale.minimumMachines}</li>
                    <li>- Max: {scale.maximumMachines}</li>
                  </ul>
                ))}
              </ul>
              <br />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
