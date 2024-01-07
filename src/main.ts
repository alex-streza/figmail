import { getSelectedNodesOrAllNodes } from "@create-figma-plugin/utilities";
import { buildPromptForGeneratingCode, buildPromptForGeneratingCodeForChunk } from "./chatGPT/buildPrompt";
import { buildTagTree } from "./figmaNode/buildTagTree";
import { divideTagTreeToChunks } from "./figmaNode/divideTagTreeToChunks";
import { removeUnnecessaryPropsFromTagTree } from "./figmaNode/removeUnnecessaryPropsFromTagTree";

const openAIAPIKey = "";

export default function () {
	const selectedNode = getSelectedNodesOrAllNodes()[0];
	const usedComponentNodes: ComponentNode[] = [];

	const thisTagTree = buildTagTree(selectedNode, usedComponentNodes);

	if (!thisTagTree) {
		figma.notify("No visible nodes found");
		figma.closePlugin();
		return;
	}

	const chunks = divideTagTreeToChunks(thisTagTree);

	if (figma.editorType === "dev" && figma.mode === "codegen") {
		// Register a callback to the "generate" event
		figma.codegen.on("generate", async ({ node }) => {
			const nodeJSON = removeUnnecessaryPropsFromTagTree(thisTagTree);
			const prompt = buildPromptForGeneratingCode(JSON.stringify(nodeJSON), []);

			const chunkPrompts = chunks.map((chunk) => {
				return buildPromptForGeneratingCodeForChunk(JSON.stringify(chunk), []);
			});

			if (chunkPrompts.length === 0) {
				const code = prompt; // await createChatCompletion(openAIAPIKey, prompt, [], true);

				return [
					{
						title: "JSON for " + node.name,
						language: "JSON",
						code: JSON.stringify(nodeJSON, null, 2),
					},
				];
			}

			return [
				{
					title: "JSON for " + node.name,
					language: "JSON",
					code: JSON.stringify(
						{
							error: "Exceeds the maximum token count, maybe the email is a tad bit too long?",
						},
						null,
						2
					),
				},
			];
		});
	}
}
