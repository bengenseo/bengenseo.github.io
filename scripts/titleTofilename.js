const path = require('path');
const fs = require('fs');

hexo.extend.filter.register('before_post_render', function(data) {
  // 检查文件扩展名，确保只处理 Markdown 文件
  if (path.extname(data.source) !== '.md') {
    return data;
  }

  try {
    // 构建 Markdown 文件的完整路径
    const postPath = path.join(hexo.source_dir, data.source);

    // 读取文件内容
    const content = fs.readFileSync(postPath, 'utf-8');

    // 尝试从 Markdown 内容中提取标题
    let title = '';
    const lines = content.split('\n');
    for (let line of lines) {
      line = line.trim();
      if (line.startsWith('# ')) {
        title = line.replace(/^# /, '').trim();
        break;
      }
    }

    // 如果没有从内容中找到标题，则使用文件名作为标题
    if (!title) {
      title = path.basename(data.source, path.extname(data.source));
    }

    // 更新前置标记中的标题
    let newContent = content.replace(/---\n([\s\S]*?)\n---/, (match, frontMatter) => {
      if (!/title:/.test(frontMatter)) {
        frontMatter += `\ntitle: ${title}`;
      } else {
        frontMatter = frontMatter.replace(/title:\s*(.*)/, `title: ${title}`);
      }
      return `---\n${frontMatter}\n---`;
    });

    // 如果没有 front matter，则添加
    if (!/---\n[\s\S]*?\n---/.test(content)) {
      newContent = `---\ntitle: ${title}\n---\n\n${content}`;
    }

    // 将更新后的内容写回文件
    fs.writeFileSync(postPath, newContent, 'utf-8');

    // 更新 Hexo 数据对象中的标题字段
    data.title = title;

  } catch (err) {
    // 处理可能的错误，比如文件不存在或者读取错误
    console.error(`Error processing ${data.source}: ${err.message}`);
  }

  return data;
});