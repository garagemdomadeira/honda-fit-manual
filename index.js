const fs = require('fs').promises;
const path = require('path');
const { glob } = require('glob');

const rootFolder = './manual';
const scriptToReplace = 'Embraiagem'
const scriptToAdd = 'Embreagem';

(async () => {
  const files = await glob(rootFolder + '/**/*.html');

  for (const file of files) {
    try {
      const data = await fs.readFile(file, 'latin1');

      const updatedData = data.replace(scriptToReplace, scriptToAdd);

      await fs.writeFile(file, updatedData, 'latin1');
      console.log(`Arquivo ${file} atualizado com sucesso!`);
    } catch (err) {
      console.error(`Erro ao processar o arquivo ${file}:`, err);
    }
  }
})();
