import { OpenAIAPIError } from './chatGPT/OpenAIAPIError';
import { Tag } from './figmaNode/buildTagTree';
import { OriginalNodeTree, SavedGqlQuery } from './types';

export type UiToPluginMessage =
  | {
      type: 'save-gql-query';
      nodeId: string;
      originalQuery: string;
      editingMode: 'query' | 'fragment';
      textForViewer: string;
    }
  | {
      type: 'error-char-completion';
      error: OpenAIAPIError;
    }
  | {
      type: 'save-openai-key';
      openAiKey: string;
    };

export type PluginToUiMessage =
  | {
      type: 'sendSelectedNode';
      nodeId: string;
      nodeJSON: Tag;
      chunks: Tag[];
      originalNodeTree: OriginalNodeTree;
      usedComponentNames: string[];
      savedGqlQuery: SavedGqlQuery | null;
      childFragmentStrings: string[];
    }
  | {
      type: 'get-openai-key';
      openAiKey: string | null;
    };
