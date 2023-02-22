import { MyDisplay } from "../core/myDisplay";
import { Util } from "../libs/util";
import { Func } from "../core/func";
import { Tween } from "../core/tween";
import { MousePointer } from "../core/mousePointer";

// -----------------------------------------
//
// -----------------------------------------
export class Contents extends MyDisplay {

  private _line: number = 10;
  private _blocks: Array<{con:HTMLElement, img:HTMLElement}> = [];

  constructor(opt:any) {
    super(opt)

    const img = document.querySelector('.js-photo img') as HTMLElement
    const block = document.querySelector('.js-photo-blocks') as HTMLElement;
    const line = this._line;
    const num = line * line;
    for(let i = 0; i < num; i++) {
      const b = document.createElement('div');
      block.append(b);
      b.append(img.cloneNode(false));

      Tween.set(b, {
        position: 'absolute',
        top: 0,
        left: 0,
        overflow: 'hidden',
      })

      const imgEl = b.querySelector('img') as HTMLElement;

      this.useGPU(imgEl);
      this.useGPU(b);

      this._blocks.push({
        con: b,
        img: imgEl,
      });

    }
  }



  protected _update(): void {
    super._update();

    Tween.set(document.querySelector('.js-photo') as HTMLElement, {
      width: Math.min(Func.sw(), Func.sh()) * 0.75,
    })

    let mx = MousePointer.instance.normal.x;
    let my = MousePointer.instance.normal.y;
    mx = Util.map(mx, 0, 1, -1, 1);
    my = Util.map(my, 0, 1, -1, 1);

    if(this._c % 2 == 0) {
      const line = this._line;
      const imgSize = this.getWidth(document.querySelector('.js-photo-blocks') as HTMLElement);
      const size = imgSize / line;


      this._blocks.forEach((val,i) => {
        const scale = 50;

        const ix = ~~(i / line);
        const iy = ~~(i % line);

        const x = (ix / (line - 0));
        const y = (iy / (line - 0));

        const dx = x - mx;
        const dy = y - my;
        const d = Math.sqrt(dx * dx + dy * dy);

        Tween.set(val.con, {
          width: size + 2,
          height: size + 2,
          left: ix * size,
          top: iy * size,
          opacity: d < 0.3 ? 1 : 0,
        })

        const size2 = scale * size;
        Tween.set(val.img, {
          scale: scale,
          x: x * -size2,
          y: y * -size2,
        })
      })
    }
  }

  protected _resize(): void {
    super._resize();
  }
}