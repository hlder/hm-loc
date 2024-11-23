import { Exception } from "handlebars";
import fs from "node:fs";
import { FileUtil } from '@ohos/hvigor';

export class CreateInitCodeUtils {
    private entryProjectPath: string
    private listImport: string[]
    private listInitCode: string[]
    constructor(entryProjectPath: string, listImport: string[], listInitCode: string[]) {
        this.entryProjectPath = entryProjectPath
        this.listImport = listImport
        this.listInitCode = listInitCode
    }

    doCreate() {
        let codeInfo = `import { Loc, LocInit } from '@hld/loc';\n`

        for (let i = 0; i < this.listImport.length; i++) {
            const itemCode = this.listImport[i];
            codeInfo += itemCode + "\n"
        }
        codeInfo += "\n"
        codeInfo += `export class EntryLocInit {\n`
        codeInfo += `  static init() {\n`

        const tempMap: Map<String, String> = new Map<string, string>()
        for (let i = 0; i < this.listInitCode.length; i++) {
            const itemCode = this.listInitCode[i];
            if (tempMap.has(itemCode)) {
                throw new Exception("重复的Loc名称:" + itemCode)
            }
            tempMap.set(itemCode, itemCode)
            codeInfo += "    " + itemCode + "\n"
        }
        codeInfo += "  }\n"
        codeInfo += "}\n"

        // 创建文件，并将内容写入该文件
        const diFileDirPath = this.entryProjectPath + "/src/main/ets/di/"
        if (!fs.existsSync(diFileDirPath)) {
            fs.mkdirSync(diFileDirPath)
        }
        const diFilePath = diFileDirPath + "EntryLocInit.ets"
        if (fs.existsSync(diFilePath)) { // 如果有文件，则先读取文件，对比是否一致，
            const fileBuffer: Buffer = FileUtil.readFileSync(diFilePath)
            const copiedBuf = Uint8Array.prototype.slice.call(fileBuffer)
            if (copiedBuf.toString() != codeInfo.toString()) {
                fs.writeFileSync(diFilePath, codeInfo)
            }
        } else {
            fs.writeFileSync(diFilePath, codeInfo)
        }
    }
}