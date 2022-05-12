Final Project for CS 294-186 Building User-Centered Programming Tools

# JupyterLab Code Analysis Extension Demo
Lots of developer tools require access to _programatic_ reading and writing of user code, as well as variable state. This is an example JupyterLab Extension that provides simple code demonstrating __how to__ programatically reading and writing notebook user code, as well as accessing variable state and type information in the user's programming environment. 
### Install Instructions
 
The `jlpm` command is JupyterLab's pinned version of
[yarn](https://yarnpkg.com/) that is installed with JupyterLab. You may use
`yarn` or `npm` in lieu of `jlpm` below.

Install Jupyter
pip3 install jupyterlab@2.2.0
(if you have jupterlab already installed, you probably want to run :
jupyter lab clean --all)

```bash
# Clone the repo to your local environment
# Move to codegen directory

# Install dependencies
jlpm
# Build Typescript source
jlpm build
# Link your development version of the extension with JupyterLab
jupyter labextension install .
# Rebuild Typescript source after making changes
jlpm build
# Rebuild JupyterLab after making any changes
jupyter lab build
```
### The running extension looks like this:
![Image of codegen extension](https://github.com/mkery/JupyterLab-CodeGen/blob/main/screenshot.png#1)

#### Missing functionality that would be useful to demo? Let us know in issues or contribute! :D
