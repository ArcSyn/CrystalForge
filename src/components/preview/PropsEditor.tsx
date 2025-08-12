import { useState, useEffect } from 'react';
import { Settings, RotateCw } from 'lucide-react';

interface PropsEditorProps {
  code: string;
  props: Record<string, any>;
  onPropsChange: (props: Record<string, any>) => void;
}

interface PropDefinition {
  name: string;
  type: 'string' | 'boolean' | 'number' | 'select' | 'object';
  defaultValue?: any;
  options?: string[];
  required?: boolean;
}

export const PropsEditor = ({
  code,
  props,
  onPropsChange
}: PropsEditorProps) => {
  const [propDefinitions, setPropDefinitions] = useState<PropDefinition[]>([]);
  const [localProps, setLocalProps] = useState<Record<string, any>>(props);

  // Extract props from TypeScript interface
  useEffect(() => {
    const interfaceMatch = code.match(/interface\s+\w+Props\s*{([^}]*)}/s);
    if (!interfaceMatch) return;

    const interfaceContent = interfaceMatch[1];
    const propLines = interfaceContent.split('\n').filter(line => line.trim());
    
    const definitions: PropDefinition[] = [];
    
    for (const line of propLines) {
      // Parse prop definition: name?: type | name: type
      const propMatch = line.match(/^\s*(\w+)(\?)?:\s*(.+?);?\s*$/);
      if (!propMatch) continue;
      
      const [, name, optional, typeStr] = propMatch;
      const required = !optional;
      
      let type: PropDefinition['type'] = 'string';
      let defaultValue: any = '';
      let options: string[] | undefined;
      
      // Detect type
      if (typeStr.includes('boolean')) {
        type = 'boolean';
        defaultValue = false;
      } else if (typeStr.includes('number')) {
        type = 'number';
        defaultValue = 0;
      } else if (typeStr.includes('|')) {
        // Union type - treat as select
        type = 'select';
        options = typeStr
          .split('|')
          .map(opt => opt.trim().replace(/['"]/g, ''))
          .filter(opt => opt && opt !== 'undefined');
        defaultValue = options[0];
      } else if (typeStr.includes('React.ReactNode') || typeStr.includes('JSX.Element')) {
        type = 'string';
        defaultValue = 'Content';
      } else if (typeStr.includes('=>')) {
        // Function type - skip for now
        continue;
      } else {
        type = 'string';
        defaultValue = '';
      }
      
      // Set common defaults
      if (name === 'children') {
        defaultValue = 'Button Text';
      } else if (name === 'title') {
        defaultValue = 'Component Title';
      } else if (name === 'description') {
        defaultValue = 'This is a description text';
      } else if (name === 'label') {
        defaultValue = 'Label';
      } else if (name === 'placeholder') {
        defaultValue = 'Enter text...';
      } else if (name === 'variant' && options) {
        defaultValue = options[0];
      } else if (name === 'size' && options) {
        defaultValue = 'md';
      }
      
      definitions.push({
        name,
        type,
        defaultValue,
        options,
        required
      });
    }
    
    setPropDefinitions(definitions);
    
    // Initialize props with defaults
    const initialProps: Record<string, any> = {};
    definitions.forEach(def => {
      if (def.required || def.name === 'children') {
        initialProps[def.name] = def.defaultValue;
      }
    });
    setLocalProps(initialProps);
    onPropsChange(initialProps);
  }, [code]);

  const handlePropChange = (name: string, value: any) => {
    const newProps = { ...localProps, [name]: value };
    setLocalProps(newProps);
    onPropsChange(newProps);
  };

  const handleToggleProp = (name: string, definition: PropDefinition) => {
    if (localProps.hasOwnProperty(name)) {
      const newProps = { ...localProps };
      delete newProps[name];
      setLocalProps(newProps);
      onPropsChange(newProps);
    } else {
      handlePropChange(name, definition.defaultValue);
    }
  };

  const handleReset = () => {
    const resetProps: Record<string, any> = {};
    propDefinitions.forEach(def => {
      if (def.required || def.name === 'children') {
        resetProps[def.name] = def.defaultValue;
      }
    });
    setLocalProps(resetProps);
    onPropsChange(resetProps);
  };

  return (
    <div className="h-full flex flex-col bg-zinc-800">
      {/* Header */}
      <div className="p-3 border-b border-zinc-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Settings className="w-4 h-4 text-purple-400" />
            <span className="text-sm font-medium text-white">Component Props</span>
          </div>
          <button
            onClick={handleReset}
            className="p-1 hover:bg-zinc-700 rounded transition-colors"
            title="Reset all props"
          >
            <RotateCw className="w-3 h-3 text-zinc-400" />
          </button>
        </div>
      </div>

      {/* Props List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {propDefinitions.length === 0 ? (
          <div className="text-center text-zinc-500 text-sm py-8">
            No props detected
          </div>
        ) : (
          propDefinitions.map(def => (
            <div key={def.name} className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm text-zinc-300 flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={localProps.hasOwnProperty(def.name)}
                    onChange={() => handleToggleProp(def.name, def)}
                    className="rounded border-zinc-600 bg-zinc-700 text-purple-600 focus:ring-purple-500"
                  />
                  <span className={def.required ? 'font-medium' : ''}>
                    {def.name}
                    {def.required && <span className="text-red-400 ml-1">*</span>}
                  </span>
                </label>
                <span className="text-xs text-zinc-500">{def.type}</span>
              </div>
              
              {localProps.hasOwnProperty(def.name) && (
                <div className="ml-6">
                  {def.type === 'boolean' ? (
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={localProps[def.name]}
                        onChange={(e) => handlePropChange(def.name, e.target.checked)}
                        className="rounded border-zinc-600 bg-zinc-700 text-purple-600 focus:ring-purple-500"
                      />
                      <span className="text-xs text-zinc-400">
                        {localProps[def.name] ? 'true' : 'false'}
                      </span>
                    </label>
                  ) : def.type === 'number' ? (
                    <input
                      type="number"
                      value={localProps[def.name]}
                      onChange={(e) => handlePropChange(def.name, Number(e.target.value))}
                      className="w-full px-2 py-1 text-sm bg-zinc-900 border border-zinc-700 rounded text-white focus:outline-none focus:border-purple-500"
                    />
                  ) : def.type === 'select' && def.options ? (
                    <select
                      value={localProps[def.name]}
                      onChange={(e) => handlePropChange(def.name, e.target.value)}
                      className="w-full px-2 py-1 text-sm bg-zinc-900 border border-zinc-700 rounded text-white focus:outline-none focus:border-purple-500"
                    >
                      {def.options.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      value={localProps[def.name] || ''}
                      onChange={(e) => handlePropChange(def.name, e.target.value)}
                      placeholder={`Enter ${def.name}...`}
                      className="w-full px-2 py-1 text-sm bg-zinc-900 border border-zinc-700 rounded text-white placeholder-zinc-600 focus:outline-none focus:border-purple-500"
                    />
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Props JSON Preview */}
      <div className="border-t border-zinc-700 p-3">
        <details className="group">
          <summary className="text-xs text-zinc-500 cursor-pointer hover:text-zinc-400">
            Props JSON
          </summary>
          <pre className="mt-2 p-2 bg-zinc-900 rounded text-xs text-zinc-400 overflow-x-auto">
            {JSON.stringify(localProps, null, 2)}
          </pre>
        </details>
      </div>
    </div>
  );
};
