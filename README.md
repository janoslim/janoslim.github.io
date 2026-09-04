# janoslim.github.io

## Building the CV

The academic CV uses XeLaTeX and is adapted from the `research-cv` format in
[Awesome-PhD-CV](https://github.com/LimHyungTae/Awesome-PhD-CV), which is based
on [Awesome-CV](https://github.com/posquit0/Awesome-CV).

```bash
xelatex -interaction=nonstopmode -halt-on-error CV.tex
xelatex -interaction=nonstopmode -halt-on-error CV.tex
```

The generated `CV.pdf` is linked from the website.
