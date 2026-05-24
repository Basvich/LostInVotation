import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-inicio-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="page-card" aria-labelledby="inicio-title">
      <h1 id="inicio-title">Inicio</h1>
      <p>Esta es la pagina principal cargada dentro del area central del layout.</p>
    </section>
  `,
  styles: `
    .page-card {
      max-width: 56rem;
      margin: 0 auto;
      padding: 1.25rem;
      border: 1px solid #d1d5db;
      border-radius: 0.75rem;
      background: #ffffff;
      box-shadow: 0 10px 20px rgba(15, 23, 42, 0.08);
    }

    h1 {
      margin: 0 0 0.75rem;
      font-size: 1.6rem;
      line-height: 1.2;
      color: #0f172a;
    }

    p {
      margin: 0;
      color: #374151;
    }
  `
})
export class InicioPage {}
