# Alipin

### Install
1. Install node
2. Install browser
3. Install pocketsphinx
    alsa-lib: http://askubuntu.com/questions/624330/how-do-i-install-alsa-lib-from-launchpad
    sphinxbase && pocketsphinx: http://cmusphinx.sourceforge.net/wiki/tutorialpocketsphinx
4. Create dic and lm files using: http://www.speech.cs.cmu.edu/tools/lmtool-new.html
5. Test pocketsphinx using: pocketsphinx_continuous -inmic yes -logfn /dev/null -hmm /usr/local/share/pocketsphinx/model/en-us/en-us -dict absolute path_to_.dic -lm absolute path_to_.lm > test_out.txt

### Build client
```
npm run build
```

### Run
```
npm run start
```

### Test
```
npm run test
```