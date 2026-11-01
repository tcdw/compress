import { Divider } from '@tuuject/koi-react/divider';
import { Link } from '@tuuject/koi-react/link';
import { css } from '@tuuject/koi-react/styled-system/css';
import { CompareModal } from './components/CompareModal';
import { ExportPanel } from './components/ExportPanel';
import { GlobalSettings } from './components/GlobalSettings';
import { ImageGrid } from './components/ImageGrid';
import { CatIcon } from './components/icons';
import { ThemeToggle } from './components/ThemeToggle';
import { useImageProcessor } from './hooks/useImageProcessor';
import {
  CONTENT_MAX_WIDTH,
  SHELL_Z_INDEX,
  SIDEBAR_WIDTH,
  TOPBAR_HEIGHT,
} from './lib/styles';

export function App() {
  useImageProcessor();

  return (
    <div
      className={css({
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
      })}
    >
      <header
        className={css({
          position: 'sticky',
          top: '0',
          zIndex: SHELL_Z_INDEX,
          bg: 'surface',
          borderBottomWidth: '1px',
          borderBottomStyle: 'solid',
          borderBottomColor: 'divider',
        })}
      >
        <div
          className={css({
            maxWidth: CONTENT_MAX_WIDTH,
            marginInline: 'auto',
            height: TOPBAR_HEIGHT,
            paddingInline: { base: '5', md: '6' },
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '4',
          })}
        >
          <div
            className={css({ display: 'flex', alignItems: 'center', gap: '2' })}
          >
            <CatIcon size={16} className={css({ color: 'text-brand' })} />
            <h1 className={css({ margin: '0', textStyle: 'heading-3' })}>
              压缩喵
            </h1>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <div
        className={css({
          width: '100%',
          maxWidth: CONTENT_MAX_WIDTH,
          marginInline: 'auto',
          paddingInline: { base: '5', md: '6' },
          paddingBlock: '6',
          display: 'flex',
          flexDirection: { base: 'column', md: 'row' },
          alignItems: 'flex-start',
          gap: '6',
        })}
      >
        <aside
          className={css({
            width: { base: '100%', md: SIDEBAR_WIDTH },
            flexShrink: 0,
            position: { md: 'sticky' },
            top: { md: `calc(${TOPBAR_HEIGHT} + 24px)` },
          })}
        >
          <div
            className={css({
              display: 'flex',
              flexDirection: 'column',
              gap: '5',
            })}
          >
            <section>
              <h2
                className={css({
                  margin: '0',
                  marginBlockEnd: '4',
                  textStyle: 'heading-3',
                })}
              >
                压缩设置
              </h2>
              <GlobalSettings />
            </section>

            <Divider />

            <section>
              <h2
                className={css({
                  margin: '0',
                  marginBlockEnd: '4',
                  textStyle: 'heading-3',
                })}
              >
                导出
              </h2>
              <ExportPanel />
            </section>

            <Divider />

            <footer
              className={css({
                display: 'flex',
                flexDirection: 'column',
                gap: '1',
                textStyle: 'small',
                color: 'text-muted',
              })}
            >
              <p className={css({ margin: '0' })}>所有处理均在浏览器本地完成</p>
              <p className={css({ margin: '0' })}>图片不会上传到服务器</p>
              <p className={css({ margin: '0' })}>
                © {process.env.BUILD_YEAR} tcdw，以 MIT 协议发布
              </p>
              <p className={css({ margin: '0' })}>
                <Link href="https://github.com/tcdw/compress" external>
                  GitHub
                </Link>
              </p>
            </footer>
          </div>
        </aside>

        <main className={css({ flex: '1', minWidth: '0', width: '100%' })}>
          <ImageGrid />
        </main>
      </div>

      <CompareModal />
    </div>
  );
}

export default App;
