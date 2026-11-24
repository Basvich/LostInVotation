# LostInVotation

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.2.11.

## UI components

The application uses Angular Material 22 for its UI components. The Angular
Material theme is configured in `src/styles.scss`.

## Agrupación de partidos

Al seleccionar las votaciones, el porcentaje mínimo por partido es del 5 % por
defecto y puede ajustarse entre 0 y 100. En cada votación se compara por separado
el número de votos de cada partido con el total de votos contabilizados: los
partidos por debajo del umbral se agrupan en «Otros partidos». Un partido que
alcanza exactamente el umbral permanece separado. «No Votando» se mantiene
independiente de esta agrupación.

En los diagramas Sankey, un mismo partido utiliza el mismo color en origen y
destino; los colores se mantienen al cambiar de escenario o de estadístico.

## Simplificación de flujos

La opción «Simplificar flujos recíprocos» está activada por defecto. Tras generar
cada escenario se compensan los flujos en sentidos opuestos entre cada par de
partidos, incluidos «Otros partidos» y «No Votando». Entre cada par se conserva
la diferencia en el sentido mayor y los votos compensados se suman al flujo de
permanencia de cada partido. Así se conservan los totales de origen y destino
de cada escenario. Desactiva la opción para conservar los flujos completos sin
compensar.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Publishing to GitHub Pages

[angular-cli-ghpages](https://www.npmjs.com/package/angular-cli-ghpages#prerequisites)

The `public` directory, including the sample files under `public/data`, is
copied into the production build. The deployment target is configured with the
`/LostInVotation/` base URL, so it can be published with:

```bash
ng deploy
```

The deployed application is available at
[LostInVotation](https://basvich.github.io/LostInVotation).

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

Run tests once (without watch mode):

```bash
npm run test:once
```

## Importing votation files (XML -> JSON)

The repository includes a conversion utility prepared for multiple source formats.

Current supported format:

- XML files exported like the election files under `src/assets/data/votations`

Generate JSON files (default output: `src/assets/data/votations/json`):

```bash
npm run import:votations
```

Generate JSON files directly into public assets (served by Angular build):

```bash
npm run import:votations:public
```

Convert a single file:

```bash
npm run import:votations -- --file src/assets/data/votations/andalucia.2018.xml
```

Additional options:

```bash
npm run import:votations -- --input src/assets/data/votations --output public/data/votations
```

## Importar estadísticas CSV

Para importar un CSV de estadísticas de candidaturas, proporciona la fecha
(año y mes), la zona, el nombre de la votación y el total de votos
contabilizados, incluidos blancos y nulos. El CSV no contiene este total y los
porcentajes redondeados no permiten reconstruirlo con precisión.

```bash
npm run import:votations:csv -- --file src/assets/data/votations/estadisticas.congreso.202307.csv --date 2023-07 --zone "España" --name "Congreso 2023" --total-votes <total-contabilizado>
```

El JSON se escribe en `src/assets/data/votations/json` con el nombre del archivo
original. Usa `--output <directorio>` para cambiar el destino o `--compact`
para escribir JSON sin formato. La fecha se guarda como el primer día del mes
en UTC; la zona y los identificadores de candidaturas se normalizan igual que
en el importador XML. El CSV debe contener una única convocatoria y ámbito
geográfico, sin candidaturas duplicadas. El total de votos a candidaturas se
calcula sumando sus votos y no puede superar el total contabilizado.

La conversión no añade automáticamente la votación al catálogo
`public/data/availableVotations.json`.

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
