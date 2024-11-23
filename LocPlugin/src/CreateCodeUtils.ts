import fs from "node:fs";
import { FileUtil } from '@ohos/hvigor';

export class CreateCodeUtils {
    private listParams: MethodGetProviderParams[] = []
    private moduleName: string
    private modulePath: string

    private listInitCode: string[]

    diClassName: string = ""

    constructor(moduleName: string, modulePath: string, listInitCode: string[]) {
        this.moduleName = moduleName
        this.modulePath = modulePath
        this.listInitCode = listInitCode
    }

    // 添加item
    addItem(item: MethodGetProviderParams) {
        this.listParams.push(item)
    }

    deleteFile() {
        let diClassName = this.moduleName + "Di"
        // 首字母大写
        diClassName = diClassName.charAt(0).toUpperCase() + diClassName.slice(1);
        const diFileDirPath = this.modulePath + "/src/main/ets/di/"
        const diFilePath = diFileDirPath + diClassName + ".ets"
        if (fs.existsSync(diFilePath)) {
            // 删除di文件
            fs.unlink(diFilePath, () => { })
        }
        // 删除index文件中的di导出内容
        const indexFilePath = this.modulePath + "/index.ets"
        if (fs.existsSync(indexFilePath)) {
            const fileBuffer: Buffer = fs.readFileSync(indexFilePath)
            let codeStr = Uint8Array.prototype.slice.call(fileBuffer).toString();

            const tempExport = "./src/main/ets/di/" + diClassName
            if (codeStr.includes(tempExport)) { // 存在，则需要删除
                codeStr = codeStr.replace(`\nexport * from '${tempExport}'`, "") // 先删除带换行符的
                codeStr = codeStr.replace(`export * from '${tempExport}'`, "") // 如果没有换行符，比如被人为调到了第一行，那么再执行删除
                fs.writeFileSync(indexFilePath, codeStr)
            }
        }
    }

    // 创建代码文件
    doCreateCode() {
        if (this.listParams.length <= 0) {
            this.deleteFile()
            return
        }
        let diClassName = this.moduleName + "Di"
        // 首字母大写
        diClassName = diClassName.charAt(0).toUpperCase() + diClassName.slice(1);
        this.diClassName = diClassName

        const importStr = this.getImportStr()

        let codeInfo = `${importStr}\n@Di\n`
        codeInfo += `export class ${diClassName} { \n`
        for (let i = 0; i < this.listParams.length; i++) {
            const item = this.listParams[i];
            let funStr = `  static get${item.className}(): LocProvider { \n`
            if (item.interfaceName) {
                funStr += `    return (): ${item.interfaceName} => { \n`
            } else {
                funStr += `    return (): ${item.className} => { \n`
            }
            funStr += `      return new ${item.className}() \n`
            funStr += "    } \n"
            funStr += "  } \n"

            codeInfo += funStr

            this.listInitCode.push("Loc[\"" + item.locKey + "\"] = \"" + item.locValue + "\"")
            this.listInitCode.push(`LocInit.addProvider(Loc["${item.locKey}"], ${diClassName}.get${item.className}())`)
        }

        codeInfo += "} \n"

        // 创建文件，并将内容写入该文件
        const diFileDirPath = this.modulePath + "/src/main/ets/di/"
        if (!fs.existsSync(diFileDirPath)) {
            fs.mkdirSync(diFileDirPath)
        }
        const diFilePath = diFileDirPath + diClassName + ".ets"
        if (fs.existsSync(diFilePath)) { // 如果有文件，则先读取文件，对比是否一致，
            const fileBuffer: Buffer = FileUtil.readFileSync(diFilePath)
            const copiedBuf = Uint8Array.prototype.slice.call(fileBuffer)
            if (copiedBuf.toString() != codeInfo.toString()) {
                fs.writeFileSync(diFilePath, codeInfo)
            }
        } else {
            fs.writeFileSync(diFilePath, codeInfo)
        }

        this.addExportIndex(diClassName)
    }

    // 往模块的index.ets文件中添加导出内容
    private addExportIndex(diClassName: string) {
        const indexFilePath = this.modulePath + "/index.ets"
        if (fs.existsSync(indexFilePath)) {
            const fileBuffer: Buffer = fs.readFileSync(indexFilePath)
            const codeStr = Uint8Array.prototype.slice.call(fileBuffer).toString();

            const tempExport = "./src/main/ets/di/" + diClassName
            if (!codeStr.includes(tempExport)) { // 不存在，则需要添加
                fs.appendFileSync(indexFilePath, `\nexport * from '${tempExport}'`)
            }
        }
    }

    private getImportStr(): string {
        const map: Map<string, string> = new Map<string, string>()
        for (let i = 0; i < this.listParams.length; i++) {
            const item = this.listParams[i];
            for (let j = 0; j < item.imports.length; j++) {
                const itemImport = item.imports[j] ?? ""
                const regex = /\{([^)]+)\}/g;
                const match = regex.exec(itemImport)
                let contentStr: string = match ? match[1] : ""
                map.set(contentStr, itemImport)
            }
        }

        let importStr = "import { LocProvider,Di } from '@hld/loc';\n"
        map.forEach((value: string, key: string) => {
            importStr += value + "\n"
        })
        return importStr
    }
}

export interface MethodGetProviderParams {
    imports: string[]
    interfaceName?: string
    className: string
    locKey: string
    locValue: string
}
