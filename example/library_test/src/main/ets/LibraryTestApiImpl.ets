import { Inject } from '@hld/loc';
import { LibraryTestApi } from './LibraryTestApi';

@Inject()
export class LibraryTestApiImpl implements LibraryTestApi {
  getView(): WrappedBuilder<[string]> {
    return wrapBuilder(testText)
  }
}

@Builder
function testText(text?: string) {
  Text(text).padding(20)
    .fontColor(Color.White)
    .width('100%')
    .backgroundColor(Color.Blue)
}

@Inject("LibraryTestApiImpl2")
export class LibraryTestApiImpl2 implements LibraryTestApi {
  getView(): WrappedBuilder<[string]> {
    return wrapBuilder(testText)
  }
}