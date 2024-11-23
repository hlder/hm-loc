import { HvigorNode, HvigorPlugin, FileUtil } from '@ohos/hvigor';
import { CreateCodeUtils, MethodGetProviderParams } from './CreateCodeUtils';
import { CreateInitCodeUtils } from './CreateInitCodeUtils';
import fs from "node:fs";
// api参考文档：https://developer.huawei.com/consumer/cn/doc/harmonyos-guides-V5/ide-hvigor-api-V5
export function locPlugin(): HvigorPlugin {
    return {
        pluginId: 'locPlugin',
        apply(node: HvigorNode) {
            parseEntryModule(node)
        }
    }
}

function parseEntryModule(node: HvigorNode) {
    // init中的代码内容
    const listInitCode: string[] = []
    const listImport: string[] = []

    const nodePath = node.getNodePath()

    const fileBuffer: Buffer = FileUtil.readFileSync(nodePath + "/oh-package.json5")
    const copiedBuf = Uint8Array.prototype.slice.call(fileBuffer);
    const jsonStr = copiedBuf.toString().replace(/,\s*}/, '}').replace(/,\s*]/, ']');
    let config = JSON.parse(jsonStr);
    const keys = Object.keys(config.dependencies)
    for (let index = 0; index < keys.length; index++) {
        const key = keys[index];
        const item = config.dependencies[key]
        const modulePath: string = item.replace("file:", "")
        const arr: string[] = item.split("/")
        const moduleName = arr[arr.length - 1]

        const createCodeUtils: CreateCodeUtils = new CreateCodeUtils(moduleName, nodePath + "/" + modulePath, listInitCode)
        scanOneModule(createCodeUtils, moduleName, nodePath + "/" + modulePath)

        if (createCodeUtils.diClassName && createCodeUtils.diClassName.length > 0) {
            listImport.push(`import { ${createCodeUtils.diClassName} } from '${key}';`)
        }
    }

    // 扫描Entry模块
    const createCodeUtils: CreateCodeUtils = new CreateCodeUtils(node.getNodeName(), nodePath, listInitCode)
    scanOneModule(createCodeUtils, node.getNodeName(), nodePath)
    if (createCodeUtils.diClassName && createCodeUtils.diClassName.length > 0) {
        listImport.push(`import { ${createCodeUtils.diClassName} } from './${createCodeUtils.diClassName}';`)
    }

    const utils = new CreateInitCodeUtils(nodePath, listImport, listInitCode)
    utils.doCreate()
}

function scanOneModule(createCodeUtils: CreateCodeUtils, moduleName: string, modulePath: string) {
    // console.log("===================================================================================================开始扫描：" + modulePath)
    const codePath = modulePath + "/src/main/ets"
    if (FileUtil.exist(codePath)) {
        traversalFiles(createCodeUtils, moduleName, codePath)
        createCodeUtils.doCreateCode()
    }else{
        createCodeUtils.deleteFile()
    }
}

function traversalFiles(createCodeUtils: CreateCodeUtils, moduleName: string, filePath: string) {
    const files = fs.readdirSync(filePath);
    // 遍历文件列表
    files.forEach(itemFilePath => {
        const absolutePath = filePath + "/" + itemFilePath
        if (FileUtil.isDictionary(absolutePath)) { // 是目录，递归调用
            traversalFiles(createCodeUtils, moduleName, absolutePath)
        } else { // 是文件，则处理文件
            parseOneFile(createCodeUtils, absolutePath, itemFilePath)
        }
    });
}

function parseOneFile(createCodeUtils: CreateCodeUtils, filePath: string, fileName: string) {
    const fileBuffer: Buffer = FileUtil.readFileSync(filePath)
    const codeStr = Uint8Array.prototype.slice.call(fileBuffer).toString();
    if (codeStr.includes("@Inject")) { // 包含@Inject，需要对其生成文件
        autoCreateCode(createCodeUtils, filePath, fileName, codeStr)
    }
}

function autoCreateCode(createCodeUtils: CreateCodeUtils, filePath: string, fileName: string, codeStr: string) {
    // 将代码按换行分割
    const lines: string[] = codeStr.split("\n")
    // console.log("=================================================================================开始处理文件:" + filePath);
    for (let index = 0; index < lines.length; index++) {
        const line = lines[index].trim();
        if (line.startsWith("@Inject")) {
            // 使用正则表达式匹配括号中的内容
            const regex = /\(([^)]+)\)/g;
            const match = regex.exec(line)
            let key: string = match ? match[1] : ""
            key = key.replace(/[\"]/g, "").trim()
            const params: MethodGetProviderParams = {
                imports: [],
                interfaceName: "",
                className: "",
                locKey: "",
                locValue: "",
            }
            parseParams(params, lines, index)
            if (key && key.length >= 0) { // 用户有自定义key，使用自定义的key
                params.locKey = key
                params.locValue = key
            }
            getImportStr(params, lines, filePath, fileName)
            createCodeUtils.addItem(params)
        }
    }
}

// 获取import内容
function getImportStr(params: MethodGetProviderParams, lines: string[], filePath: string, fileName: string) {
    const temList: string[] = filePath.split("src/main/ets/")
    if (temList.length > 1) {
        const importStr: string = "../" + temList[1].replace(".ets", "")
        params.imports.push("import { " + params.className + " } from '" + importStr.trim() + "';")
    }
    if (params.interfaceName) {
        for (let index = 0; index < lines.length; index++) {
            const tempLine = lines[index]
            if (!tempLine.startsWith("//") && tempLine.startsWith("import") && tempLine.includes(params.interfaceName)) {
                const arr = tempLine.split("from")
                let value = arr[arr.length - 1].trim().replace(/[\']/g, "").replace(/[\"]/g, "").replace(";", "")

                if (value.startsWith("./") || value.startsWith("../")) { // 本地目录
                    const fa: string[] = filePath.split("/")
                    const path = filePath.replace("/" + fa[fa.length - 1], "")
                    let absolutePath: string
                    if (value.startsWith("./")) {
                        absolutePath = path + "/" + params.interfaceName
                    } else {
                        absolutePath = path + "/" + value
                    }
                    const temArr = absolutePath.split("src/main/ets/")
                    const importValue = temArr[temArr.length - 1]
                    params.imports.push(`import { ${params.interfaceName} } from '../${importValue}';`)
                } else { // 其他模块
                    params.imports.push(tempLine)
                }
            }
        }
    }
}

function parseParams(params: MethodGetProviderParams, lines: string[], startIndex: number) {
    for (let index = startIndex; index < lines.length; index++) {
        const line = lines[index];
        if (!line.includes("/") && line.includes(" class ")) {
            let regex = /class(.*?){/; // 使用非贪婪模式匹配

            let className: string = ""
            let interfaceName: string | undefined = undefined
            let locKey: string = ""

            if (line.includes(" implements ")) { // 有接口
                regex = /class(.*?)implements/; // 使用非贪婪模式匹配
                const match = regex.exec(line);
                className = match ? match[1] : ""

                if (!line.includes(",")) {// 只实现了一个接口，直接取接口名
                    regex = /implements(.*?){/; // 使用非贪婪模式匹配
                    const match = regex.exec(line);
                    interfaceName = match ? match[1] : ""
                } else { // 实现了多个接口
                    regex = /class(.*?)implements/; // 使用非贪婪模式匹配
                }
            } else {
                const match = regex.exec(line);
                className = match ? match[1] : ""
            }

            interfaceName = interfaceName?.trim()
            className = className.trim()
            if (interfaceName && interfaceName.length > 0) {
                locKey = interfaceName
            } else {
                locKey = className
            }
            params.locKey = locKey
            params.locValue = locKey
            params.interfaceName = interfaceName
            params.className = className
            return
        }
    }
    return
}