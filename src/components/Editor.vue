<template>
  <div v-if="editor" ref="editor" :style="{ width }" class="vue-editor">
    <editor-menu-bar
      v-slot="{ commands, isActive, getMarkAttrs }"
      :editor="editor"
    >
      <div class="menubar">
        <button
          v-tooltip.bottom="'加粗'"
          type="button"
          class="menubar__button"
          :class="{ 'is-active': isActive.bold() }"
          @click="commands.bold"
        >
          <svg fill="currentColor" viewBox="0 0 24 24" width="24" height="24">
            <path
              d="M9 17.025V13h4.418c1.19 0 2.415.562 2.415 2.012s-1.608 2.013-2.9 2.013H9zM9 7h4.336c1 0 1.814.888 1.814 2 0 .89-.814 2-1.814 2H9V7zm8.192 1.899a3.893 3.893 0 0 0-3.888-3.889S9.334 5 8.167 5C7 5 7 6.167 7 6.167v11.666C7 19 8.167 19 8.167 19l5.572.01c2.333 0 4.231-1.86 4.231-4.148a4.122 4.122 0 0 0-1.77-3.372 3.873 3.873 0 0 0 .992-2.591z"
              fill-rule="evenodd"
            ></path>
          </svg>
        </button>

        <button
          v-tooltip.bottom="'斜体'"
          type="button"
          class="menubar__button"
          :class="{ 'is-active': isActive.italic() }"
          @click="commands.italic"
        >
          <svg fill="currentColor" viewBox="0 0 24 24" width="24" height="24">
            <path
              d="M15.751 5h-5.502a.751.751 0 0 0-.749.75c0 .417.336.75.749.75H12l-2 11H8.249a.751.751 0 0 0-.749.75c0 .417.336.75.749.75h5.502a.751.751 0 0 0 .749-.75.748.748 0 0 0-.749-.75H12l2-11h1.751a.751.751 0 0 0 .749-.75.748.748 0 0 0-.749-.75"
              fill-rule="evenodd"
            ></path>
          </svg>
        </button>
        <div ref="colorPicker" class="relative inline-block">
          <button
            v-tooltip.bottom="'颜色'"
            type="button"
            class="menubar__button relative"
            :class="{
              'is-active': isActive.color() || isActive.fill(),
            }"
            @click="colorPickerVisible = !colorPickerVisible"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M0 0h24v24H0z" fill="none" />
              <path fill-opacity=".36" d="M0 20h24v4H0z" />
              <path
                d="M11 3L5.5 17h2.25l1.12-3h6.25l1.12 3h2.25L13 3h-2zm-1.38 9L12 5.67 14.38 12H9.62z"
              />
            </svg>
          </button>
          <div v-if="colorPickerVisible" class="color-picker">
            <div style="display:flex;">
              <div
                :class="{
                  'text-primary-dark border-b-2 border-primary-dark': !colorFill,
                }"
                class="cursor-pointer py-1 text-black flex-grow text-center"
                @click="colorFill = false"
              >
                文字
              </div>
              <div
                :class="{
                  'text-primary-dark border-b-2 border-primary-dark': colorFill,
                }"
                class="cursor-pointer py-1 text-black flex-grow text-center"
                @click="colorFill = true"
              >
                背景
              </div>
            </div>
            <div class="flex flex-wrap py-4 px-2 justify-center">
              <div v-for="color in colors" :key="color">
                <button
                  type="button"
                  class="hover:border border-gray cursor-pointer"
                  style="border-radius:0px; width:24px;height:24px;border:0; margin-left:2px;margin-right:2px;"
                  :style="{ 'background-color': color }"
                  @click="selectColor(commands, color)"
                ></button>
              </div>
              <div class="flex items-center" style="margin-top:20px;">
                <form
                  class="flex"
                  :style="{ 'align-items': 'flex-start' }"
                  @submit.prevent="selectColor(commands, userColor, true)"
                >
                  <div class="flex flex-col">
                    <input
                      class="color-input"
                      maxlength="7"
                      placeholder="#FFFFFF"
                      v-model.trim="userColor"
                    />
                    <span class="error">{{ colorError }}</span>
                  </div>
                  <button type="submit" class="color-confirm-button">
                    确认
                  </button>
                </form>
              </div>
              <!-- <div class="flex items-center">
                <span>其他颜色</span>
                <el-color-picker
                  v-model="userColor"
                  class="mx-4"
                  @change="selectColor(commands, userColor)"
                ></el-color-picker>
              </div> -->
            </div>
          </div>
        </div>
        <button
          v-tooltip.bottom="'上传图片（支持拖拽和粘贴）'"
          type="button"
          class="menubar__button"
          @click="$refs.uploadInput.click()"
        >
          <svg fill="currentColor" viewBox="0 0 24 24" width="24" height="24">
            <path
              d="M21 17.444C21 18.3 20.1 19 19 19H5c-1.1 0-2-.7-2-1.556V6.556C3 5.7 3.9 5 5 5h14c1.1 0 2 .7 2 1.556v10.888zm-9.437-3.919a.5.5 0 0 1-.862.013l-1.26-2.065a.5.5 0 0 0-.861.012l-2.153 3.767a.5.5 0 0 0 .435.748h10.292a.5.5 0 0 0 .438-.741L14.573 9.78a.5.5 0 0 0-.872-.006l-2.138 3.75z"
              fill-rule="evenodd"
            ></path>
          </svg>
        </button>
        <input
          ref="uploadInput"
          type="file"
          style="display:none"
          @change="fileSelect($event, commands.image)"
        />
        <button
          v-tooltip.bottom="'无序列表'"
          type="button"
          class="menubar__button"
          :class="{ 'is-active': isActive.bullet_list() }"
          @click="commands.bullet_list"
        >
          <svg fill="currentColor" viewBox="0 0 24 24" width="24" height="24">
            <path
              d="M9 7c0-.552.456-1 .995-1h8.01c.55 0 .995.444.995 1 0 .552-.456 1-.995 1h-8.01A.995.995 0 0 1 9 7zM6 8a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm0 5a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm0 5a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm3-6c0-.552.456-1 .995-1h8.01c.55 0 .995.444.995 1 0 .552-.456 1-.995 1h-8.01A.995.995 0 0 1 9 12zm0 5c0-.552.456-1 .995-1h8.01c.55 0 .995.444.995 1 0 .552-.456 1-.995 1h-8.01A.995.995 0 0 1 9 17z"
              fill-rule="evenodd"
            ></path>
          </svg>
        </button>

        <button
          v-tooltip.bottom="'有序列表'"
          type="button"
          class="menubar__button"
          :class="{ 'is-active': isActive.ordered_list() }"
          @click="commands.ordered_list"
        >
          <svg fill="currentColor" viewBox="0 0 24 24" width="24" height="24">
            <path
              d="M9 6.5c0-.552.456-1 .995-1h8.01c.55 0 .995.444.995 1 0 .552-.456 1-.995 1h-8.01A.995.995 0 0 1 9 6.5zM5.884 7.893v-2.09h-.643L5.402 5h1.285v2.893h-.803zm.898 3.83l-.393.395h.862v.733H5v-.482l1.057-.892c.371-.312.461-.434.463-.566.003-.202-.135-.368-.396-.368-.289 0-.418.206-.418.43H5c0-.642.482-1.073 1.125-1.073s1.125.457 1.125.945c0 .307-.106.516-.468.877zM9 11.5c0-.552.456-1 .995-1h8.01c.55 0 .995.444.995 1 0 .552-.456 1-.995 1h-8.01a.995.995 0 0 1-.995-1zm0 5c0-.552.456-1 .995-1h8.01c.55 0 .995.444.995 1 0 .552-.456 1-.995 1h-8.01a.995.995 0 0 1-.995-1zm-1.759.624c0 .14-.025.27-.076.388a.902.902 0 0 1-.217.309 1.017 1.017 0 0 1-.336.205c-.13.05-.275.074-.437.074-.166 0-.32-.027-.462-.08a1.166 1.166 0 0 1-.367-.217 1.062 1.062 0 0 1-.246-.318.914.914 0 0 1-.1-.38v-.055h.765v.054a.343.343 0 0 0 .367.352c.117 0 .207-.03.27-.09.062-.06.093-.152.093-.277 0-.117-.039-.206-.117-.268a.506.506 0 0 0-.32-.091h-.14v-.516h.144c.117 0 .205-.03.264-.09a.31.31 0 0 0 .087-.226.27.27 0 0 0-.087-.209.332.332 0 0 0-.233-.08c-.107 0-.185.027-.236.08a.275.275 0 0 0-.076.197v.055h-.695v-.055a.915.915 0 0 1 .295-.644c.178-.161.436-.242.775-.242.14 0 .27.021.39.064s.224.102.312.176a.802.802 0 0 1 .207.262c.05.1.075.206.075.318 0 .258-.116.46-.348.605v.008a.625.625 0 0 1 .193.119.777.777 0 0 1 .256.572z"
              fill-rule="evenodd"
            ></path>
          </svg>
        </button>
        <button
          v-tooltip.bottom="'插入分割线'"
          type="button"
          class="menubar__button"
          :class="{ 'is-active': isActive.horizontal_rule() }"
          @click="commands.horizontal_rule"
        >
          <svg fill="currentColor" viewBox="0 0 24 24" width="24" height="24">
            <path
              d="M4 7c0-.552.445-1 1-1h14c.552 0 1 .444 1 1 0 .552-.445 1-1 1H5c-.552 0-1-.444-1-1zm0 5a1 1 0 0 1 1.01-1h1.98a1 1 0 1 1 0 2H5.01C4.451 13 4 12.556 4 12zm6 0a1 1 0 0 1 1.01-1h1.98a1 1 0 1 1 0 2h-1.98c-.558 0-1.01-.444-1.01-1zm6 0a1 1 0 0 1 1.01-1h1.98a1 1 0 1 1 0 2h-1.98c-.558 0-1.01-.444-1.01-1zM4 17c0-.552.445-1 1-1h14c.552 0 1 .444 1 1 0 .552-.445 1-1 1H5c-.552 0-1-.444-1-1z"
              fill-rule="evenodd"
            ></path>
          </svg>
        </button>
        <button
          v-tooltip.bottom="'下划线'"
          type="button"
          class="menubar__button"
          :class="{ 'is-active': isActive.underline() }"
          @click="commands.underline"
        >
          <svg
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <path d="M0 0h24v24H0z" fill="none" />
            <path
              d="M12 17c3.31 0 6-2.69 6-6V3h-2.5v8c0 1.93-1.57 3.5-3.5 3.5S8.5 12.93 8.5 11V3H6v8c0 3.31 2.69 6 6 6zm-7 2v2h14v-2H5z"
            />
          </svg>
        </button>

        <button
          v-tooltip.bottom="'删除线'"
          type="button"
          class="menubar__button"
          :class="{ 'is-active': isActive.strike() }"
          @click="commands.strike"
        >
          <svg
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <defs>
              <path id="a" d="M0 0h24v24H0V0z" />
            </defs>
            <clipPath id="b">
              <use xlink:href="#a" overflow="visible" />
            </clipPath>
            <path
              clip-path="url(#b)"
              d="M7.24 8.75c-.26-.48-.39-1.03-.39-1.67 0-.61.13-1.16.4-1.67.26-.5.63-.93 1.11-1.29.48-.35 1.05-.63 1.7-.83.66-.19 1.39-.29 2.18-.29.81 0 1.54.11 2.21.34.66.22 1.23.54 1.69.94.47.4.83.88 1.08 1.43.25.55.38 1.15.38 1.81h-3.01c0-.31-.05-.59-.15-.85-.09-.27-.24-.49-.44-.68-.2-.19-.45-.33-.75-.44-.3-.1-.66-.16-1.06-.16-.39 0-.74.04-1.03.13-.29.09-.53.21-.72.36-.19.16-.34.34-.44.55-.1.21-.15.43-.15.66 0 .48.25.88.74 1.21.38.25.77.48 1.41.7H7.39c-.05-.08-.11-.17-.15-.25zM21 12v-2H3v2h9.62c.18.07.4.14.55.2.37.17.66.34.87.51.21.17.35.36.43.57.07.2.11.43.11.69 0 .23-.05.45-.14.66-.09.2-.23.38-.42.53-.19.15-.42.26-.71.35-.29.08-.63.13-1.01.13-.43 0-.83-.04-1.18-.13s-.66-.23-.91-.42c-.25-.19-.45-.44-.59-.75-.14-.31-.25-.76-.25-1.21H6.4c0 .55.08 1.13.24 1.58.16.45.37.85.65 1.21.28.35.6.66.98.92.37.26.78.48 1.22.65.44.17.9.3 1.38.39.48.08.96.13 1.44.13.8 0 1.53-.09 2.18-.28s1.21-.45 1.67-.79c.46-.34.82-.77 1.07-1.27s.38-1.07.38-1.71c0-.6-.1-1.14-.31-1.61-.05-.11-.11-.23-.17-.33H21z"
            />
          </svg>
        </button>
        <button
          v-tooltip.bottom="'引用块'"
          type="button"
          class="menubar__button"
          :class="{ 'is-active': isActive.blockquote() }"
          @click="commands.blockquote"
        >
          <svg fill="currentColor" viewBox="0 0 24 24" width="24" height="24">
            <path
              d="M17.975 12.209c.504.454.822 1.05.952 1.792.061.35.055.715-.022 1.096-.075.379-.209.718-.4 1.018-.465.73-1.155 1.175-2.07 1.337-.874.153-1.684-.06-2.432-.638a3.6 3.6 0 0 1-.916-1.043 3.92 3.92 0 0 1-.506-1.336c-.172-.98-.03-2.026.425-3.142.455-1.116 1.155-2.118 2.1-3.007.8-.757 1.456-1.182 1.97-1.273a.72.72 0 0 1 .544.104.656.656 0 0 1 .286.452c.054.31-.095.601-.45.877-.856.67-1.455 1.27-1.796 1.798-.323.513-.467.873-.43 1.079.034.196.21.287.524.274l.191-.001.249-.029a2.436 2.436 0 0 1 1.781.642zm-7.51 0c.504.454.821 1.05.951 1.792.062.35.056.715-.02 1.096-.077.379-.21.718-.401 1.018-.465.73-1.155 1.175-2.07 1.337-.874.153-1.684-.06-2.432-.638a3.6 3.6 0 0 1-.916-1.043 3.92 3.92 0 0 1-.506-1.336c-.172-.98-.03-2.026.424-3.142.455-1.116 1.156-2.118 2.101-3.007.8-.757 1.456-1.182 1.97-1.273a.72.72 0 0 1 .544.104.656.656 0 0 1 .285.452c.055.31-.094.601-.45.877-.855.67-1.454 1.27-1.796 1.798-.322.513-.466.873-.43 1.079.034.196.21.287.525.274l.191-.001.248-.029a2.436 2.436 0 0 1 1.782.642z"
              fill-rule="evenodd"
            ></path>
          </svg>
        </button>

        <button
          v-tooltip.bottom="'一级标题'"
          type="button"
          class="menubar__button menubar__title"
          :class="{ 'is-active': isHeadingActive({ level: 1 }) }"
          @click="commands.heading({ level: 1 })"
        >
          <span class="button-title">H1</span>
        </button>
        <button
          v-tooltip.bottom="'二级标题'"
          type="button"
          class="menubar__button menubar__title"
          :class="{ 'is-active': isHeadingActive({ level: 2 }) }"
          @click="commands.heading({ level: 2 })"
        >
          <span class="button-title">H2</span>
        </button>
        <button
          v-tooltip.bottom="'三级标题'"
          type="button"
          class="menubar__button menubar__title"
          :class="{ 'is-active': isHeadingActive({ level: 3 }) }"
          @click="commands.heading({ level: 3 })"
        >
          <span class="button-title">H3</span>
        </button>

        <div ref="fontSiziePicker" class="font-size-picker-container">
          <button
            v-tooltip.bottom="'字号'"
            type="button"
            class="menubar__button menubar__title"
            style="position:relative;"
            :class="{
              'is-active': isFontSizeActive(getMarkAttrs),
            }"
            @click="fontSizePickerVisible = !fontSizePickerVisible"
          >
            <span ref="fontButton" class="menubar__button--font">
              {{
                activeFontSize(getMarkAttrs, isActive) || currentFontSize
              }}px<i class="el-icon-caret-bottom"></i>
            </span>
          </button>
          <ul v-if="fontSizePickerVisible" class="font-size-picker">
            <li v-for="size in fontsizes" :key="size">
              <button
                type="button"
                class="font-size-picker-button"
                @click="selectFontSize(commands.fontsize, size)"
              >
                {{ size }}px
              </button>
            </li>
          </ul>
        </div>

        <button
          v-tooltip.bottom="'居左'"
          type="button"
          class="menubar__button"
          :class="{ 'is-active': isActiveAlign('left') }"
          @click="align('left')"
        >
          <svg
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <path
              d="M15 15H3v2h12v-2zm0-8H3v2h12V7zM3 13h18v-2H3v2zm0 8h18v-2H3v2zM3 3v2h18V3H3z"
            />
            <path d="M0 0h24v24H0z" fill="none" />
          </svg>
        </button>
        <button
          v-tooltip.bottom="'居中'"
          type="button"
          class="menubar__button"
          :class="{ 'is-active': isActiveAlign('center') }"
          @click="align('center')"
        >
          <svg
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <path
              d="M7 15v2h10v-2H7zm-4 6h18v-2H3v2zm0-8h18v-2H3v2zm4-6v2h10V7H7zM3 3v2h18V3H3z"
            />
            <path d="M0 0h24v24H0z" fill="none" />
          </svg>
        </button>
        <button
          v-tooltip.bottom="'居右'"
          type="button"
          class="menubar__button"
          :class="{ 'is-active': isActiveAlign('right') }"
          @click="align('right')"
        >
          <svg
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <path
              d="M3 21h18v-2H3v2zm6-4h12v-2H9v2zm-6-4h18v-2H3v2zm6-4h12V7H9v2zM3 3v2h18V3H3z"
            />
            <path d="M0 0h24v24H0z" fill="none" />
          </svg>
        </button>
        <button
          v-tooltip.bottom="'两端'"
          type="button"
          class="menubar__button"
          :class="{ 'is-active': isActiveAlign('justify') }"
          @click="align('justify')"
        >
          <svg
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <path
              d="M3 21h18v-2H3v2zm0-4h18v-2H3v2zm0-4h18v-2H3v2zm0-4h18V7H3v2zm0-6v2h18V3H3z"
            />
            <path d="M0 0h24v24H0z" fill="none" />
          </svg>
        </button>
      </div>
    </editor-menu-bar>
    <editor-content
      :style="{ height }"
      class="editor__content"
      :editor="editor"
    />
  </div>
</template>

<script>
import { nodeIsActive } from '../utils'
import { VTooltip } from 'v-tooltip'

import { Editor, EditorContent, EditorMenuBar } from 'tiptap'
import FontSize from './FontSize'
import Color from './Color'
import ColorFill from './ColorFill'
import {
  CodeBlock,
  HardBreak,
  HorizontalRule,
  OrderedList,
  BulletList,
  TodoItem,
  TodoList,
  Bold,
  Code,
  Italic,
  Link,
  Strike,
  Underline,
  History,
} from 'tiptap-extensions'
import Image from './Image'
import Heading from './Heading'
import Paragraph from './Paragraph'
import Blockquote from './Blockquote'
import ListItem from './ListItem'
import { isActive as isTextAlignActive, setTextAlign } from '../TextAlign'

export default {
  name: 'RICHEDITOR',
  components: {
    EditorMenuBar,
    EditorContent,
  },
  props: {
    height: {
      type: String,
      required: false,
      default: '',
    },
    value: {
      type: String,
      default: '',
    },
    width: {
      required: false,
      default: '700px',
      type: String,
    },
    imageProvider: {
      required: true,
      type: Object,
    },
  },
  data() {
    return {
      colorError: '',
      userColor: '',
      colorFill: false,
      fontSizePickerVisible: false,
      colorPickerVisible: false,
      currentFontSize: 16,
      linkMenuIsActive: false,
      linkUrl: null,
      editor: null,
    }
  },
  computed: {
    headingLevels() {
      return [1, 2, 3]
    },
    fontsizes() {
      const fontsizes = [12, 14, 16, 18, 20, 24]
      return fontsizes
    },
    colors() {
      const colors = [
        'rgb(0, 0, 0)',
        'rgb(38, 38, 38)',
        'rgb(89, 89, 89)',
        'rgb(140, 140, 140)',
        'rgb(191, 191, 191)',
        'rgb(217, 217, 217)',
        'rgb(233, 233, 233)',
        'rgb(245, 245, 245)',
        'rgb(250, 250, 250)',
        'rgb(255, 255, 255)',
        'rgb(245, 34, 45)',
        'rgb(250, 84, 28)',
        'rgb(250, 140, 22)',
        'rgb(250, 219, 20)',
        'rgb(82, 196, 26)',
        'rgb(19, 194, 194)',
        'rgb(24, 144, 255)',
        'rgb(47, 84, 235)',
        'rgb(114, 46, 209)',
        'rgb(235, 47, 150)',
        'rgb(255, 232, 230)',
        'rgb(255, 236, 224)',
        'rgb(255, 239, 209)',
        'rgb(255, 248, 189)',
        'rgb(228, 247, 210)',
        'rgb(211, 245, 240)',
        'rgb(212, 238, 252)',
        'rgb(222, 232, 252)',
        'rgb(239, 225, 250)',
        'rgb(250, 225, 235)',
        'rgb(255, 163, 158)',
        'rgb(255, 187, 150)',
        'rgb(255, 213, 145)',
        'rgb(255, 240, 143)',
        'rgb(183, 235, 143)',
        'rgb(135, 232, 222)',
        'rgb(145, 213, 255)',
        'rgb(173, 198, 255)',
        'rgb(211, 173, 247)',
        'rgb(255, 173, 210)',
        'rgb(255, 77, 79)',
        'rgb(255, 122, 69)',
        'rgb(255, 169, 64)',
        'rgb(255, 236, 61)',
        'rgb(115, 209, 61)',
        'rgb(54, 207, 201)',
        'rgb(64, 169, 255)',
        'rgb(89, 126, 247)',
        'rgb(146, 84, 222)',
        'rgb(247, 89, 171)',
        'rgb(207, 19, 34)',
        'rgb(212, 56, 13)',
        'rgb(212, 107, 8)',
        'rgb(212, 177, 6)',
        'rgb(56, 158, 13)',
        'rgb(8, 151, 156)',
        'rgb(9, 109, 217)',
        'rgb(29, 57, 196)',
        'rgb(83, 29, 171)',
        'rgb(196, 29, 127)',
        'rgb(130, 0, 20)',
        'rgb(135, 20, 0)',
        'rgb(135, 56, 0)',
        'rgb(97, 71, 0)',
        'rgb(19, 82, 0)',
        'rgb(0, 71, 79)',
        'rgb(0, 58, 140)',
        'rgb(6, 17, 120)',
        'rgb(34, 7, 94)',
        'rgb(120, 6, 80)',
      ]
      return colors
    },

    imageUploader() {
      const imageUploader = new Image({
        provider: this.imageProvider,
      })
      return imageUploader
    },
    state() {
      return this.editor.state
    },
    activeHeadingLevel() {
      return this.headingLevels.find(level => {
        return this.isHeadingActive({ level })
      })
    },
  },
  watch: {
    userColor() {
      this.colorError = ''
    },
    value(newVal, oldVal) {
      if (!oldVal && newVal) {
        this.editor.setContent(newVal)
      }
    },
  },
  directives: {
    tooltip: VTooltip,
  },

  mounted() {
    this.editor = new Editor({
      extensions: [
        new Paragraph(),
        new FontSize({ sizes: this.fontsizes }),
        this.imageUploader,
        new Blockquote(),
        new CodeBlock(),
        new Color(),
        new ColorFill(),
        new HorizontalRule(),
        new HardBreak(),
        new Heading({ levels: this.headingLevels }),
        new BulletList(),
        new OrderedList(),
        new ListItem(),
        new TodoItem(),
        new TodoList(),
        new Bold(),
        new Code(),
        new Italic(),
        new Link(),
        new Strike(),
        new Underline(),
        new History(),
      ],
      content: this.value,
      onUpdate: ({ getHTML }) => {
        this.$emit('input', getHTML().replace(/<p><\/p>/g, '<p><br></p>'))
      },
    })
    window.editor = this.editor

    this.closePicker = event => {
      var isClickInside = this.$refs.fontSiziePicker.contains(event.target)
      if (!isClickInside) {
        this.fontSizePickerVisible = false
      }
      isClickInside = this.$refs.colorPicker.contains(event.target)
      if (!isClickInside) {
        this.colorPickerVisible = false
      }
    }

    document.addEventListener('click', this.closePicker)
  },
  beforeDestroy() {
    document.removeEventListener('click', this.closePicker)
    this.editor.destroy()
  },

  methods: {
    isHeadingActive({ level }) {
      return nodeIsActive(this.state, this.editor.schema.nodes.heading, {
        level,
      })
    },

    isActiveAlign(align) {
      return isTextAlignActive(this.state, align)
    },

    align(alignment) {
      window.editor = this.editor
      const tr = setTextAlign(this.state.tr, this.editor.schema, alignment)
      this.editor.view.dispatch(tr)
    },

    findStoredFontSize() {
      const storedMark = (this.state.storedMarks || []).find(
        mark => mark.attrs.size
      )
      if (storedMark) {
        return storedMark.attrs.size
      }
      const prevNode =
        this.state.selection.$cursor && this.state.selection.$cursor.nodeBefore
      if (prevNode) {
        const prevMark = prevNode.marks.find(mark => mark.attrs.size)
        if (prevMark) {
          return prevMark.attrs.size
        }
      }
    },

    activeFontSize(getMarkAttrs) {
      const size = this.findStoredFontSize()
      const selectSize = this.fontsizes.find(
        size => getMarkAttrs('fontsize').size == size
      )
      if (selectSize) {
        return selectSize
      }
      return size || 16
    },

    isFontSizeActive(getMarkAttrs) {
      const size = this.findStoredFontSize()
      // 默认大小就不要active了
      if (size == 16) {
        return false
      }
      if (this.fontsizes.some(size => getMarkAttrs('fontsize').size == size)) {
        return true
      }
      return !!size
    },
    selectFontSize(command, size) {
      command({ size })
      this.fontSizePickerVisible = false
    },

    selectColor(commands, color, validate) {
      if (validate) {
        const pattern = /^#[0-9a-fA-F]{6}$/
        if (!pattern.test(color)) {
          this.colorError = '无效的色值'
          return
        }
      }
      const command = this.colorFill ? commands.fill : commands.color
      command({ color })
      this.colorPickerVisible = false
    },
    fileSelect(event, command) {
      const file = event.target.files[0]
      this.imageUploader
        .upload(file)
        .then(src => {
          command({ src })
        })
        .finally(() => {
          this.$refs.uploadInput.value = ''
        })
    },
    showLinkMenu(attrs) {
      this.linkUrl = attrs.href
      this.linkMenuIsActive = true
      this.$nextTick(() => {
        this.$refs.linkInput.focus()
      })
    },
  },
}
</script>
<style lang="scss">
$color-black: #000000;
$color-white: #ffffff;
$color-grey: #dddddd;

.flex {
  display: flex;
}
.text-primary-dark {
  color: hsl(215, 100%, 60%);
}
.justify-center {
  justify-content: center;
}
.border-primary-dark {
  border-color: hsl(215, 100%, 60%);
  border-top-color: rgb(51, 136, 255);
  border-right-color: rgb(51, 136, 255);
  border-bottom-color: rgb(51, 136, 255);
  border-left-color: rgb(51, 136, 255);
}
.border-b-2 {
  border-bottom-width: 2px;
  border-bottom-style: solid;
}
.px-2 {
  padding-left: 0.5rem;
  padding-right: 0.5rem;
}
.py-1 {
  padding-top: 0.25rem;
  padding-bottom: 0.25rem;
}
.py-2 {
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
}
.py-4 {
  padding-top: 1rem;
  padding-bottom: 1rem;
}

.flex-wrap {
  flex-wrap: wrap;
}
.flex-col {
  flex-direction: column;
}
.flex-grow {
  flex: 1;
}
.text-center {
  text-align: center;
}
.items-center {
  align-items: center;
}
.cursor-pointer {
  cursor: pointer;
}

.relative {
  position: relative;
}
.inline-block {
  display: inline-block;
}

.ProseMirror:focus {
  outline: none;
}
.ProseMirror {
  min-height: 300px;
}

.vue-editor {
  .error {
    color: red;
    font-size: 12px;
    margin-top: 5px;
  }
  .color-confirm-button {
    margin-left: 15px;
    cursor: pointer;
    color: #fff;
    background-color: #5ba0ff;
    border-color: #5ba0ff;
    padding: 7px 8px;
    font-size: 12px;
    border-radius: 3px;
    outline: none;
    transition: 0.1s;
    font-weight: 500;
    &:hover,
    &:focus {
      background: #7cb3ff;
      border-color: #7cb3ff;
      color: #fff;
    }
  }
  .color-input {
    background-color: #fff;
    background-image: none;
    border-radius: 4px;
    border: 1px solid #dcdfe6;
    font-size: 14px;
    color: #606266;
    outline: none;
    padding: 6px 8px;
    &:focus {
      outline: none;
      border-color: #5ba0ff;
    }
  }

  position: relative;
  line-height: 1.5;
  font-size: 16px;

  .editor__content {
    overflow-y: scroll;
    word-wrap: break-word;

    * {
      caret-color: currentColor;
    }

    pre {
      padding: 0.7rem 1rem;
      border-radius: 5px;
      background: $color-black;
      color: $color-white;
      font-size: 0.8rem;
      overflow-x: auto;

      code {
        display: block;
      }
    }
    p {
      margin: 0;
      margin-block-start: 0;
      margin-block-end: 0;
    }

    p code {
      display: inline-block;
      padding: 0 0.4rem;
      border-radius: 5px;
      font-size: 0.8rem;
      font-weight: bold;
      background: rgba($color-black, 0.1);
      color: rgba($color-black, 0.8);
    }

    ul,
    ol {
      padding-left: 1rem;
    }
    hr {
      border-bottom-width: 1px;
      border-bottom-style: inset;
      border-color: hsl(213, 20%, 69%);
    }
    ol,
    ol > li {
      list-style-type: decimal;
    }
    ul,
    ul > li {
      list-style-type: disc;
    }

    li > p,
    li > ol,
    li > ul {
      margin: 0;
    }
    h1,
    h2,
    h3 {
      font-weight: bold;
    }
    h1 {
      font-size: 32px;
      margin-top: 0.67em;
      margin-bottom: 0.67em;
    }
    h2 {
      font-size: 24px;
      margin-top: 0.83em;
      margin-bottom: 0.83em;
    }
    h3 {
      font-size: 18px;
      margin-top: 1em;
      margin-bottom: 1em;
    }

    a {
      color: inherit;
    }

    blockquote {
      border-left: 3px solid rgba($color-black, 0.1);
      color: rgba($color-black, 0.8);
      padding-left: 0.8rem;
      font-style: italic;

      p {
        margin: 0;
      }
    }

    img {
      max-width: 100%;
      border-radius: 3px;
    }

    table {
      border-collapse: collapse;
      table-layout: fixed;
      width: 100%;
      margin: 0;
      overflow: hidden;

      td,
      th {
        min-width: 1em;
        border: 2px solid $color-grey;
        padding: 3px 5px;
        vertical-align: top;
        box-sizing: border-box;
        position: relative;
        > * {
          margin-bottom: 0;
        }
      }

      th {
        font-weight: bold;
        text-align: left;
      }

      .selectedCell:after {
        z-index: 2;
        position: absolute;
        content: '';
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        background: rgba(200, 200, 255, 0.4);
        pointer-events: none;
      }

      .column-resize-handle {
        position: absolute;
        right: -2px;
        top: 0;
        bottom: 0;
        width: 4px;
        z-index: 20;
        background-color: #adf;
        pointer-events: none;
      }
    }

    .tableWrapper {
      margin: 1em 0;
      overflow-x: auto;
    }

    .resize-cursor {
      cursor: ew-resize;
      cursor: col-resize;
    }
  }
}
.menubar {
  margin-bottom: 1rem;
  background: #ffffff;
  border-bottom: 1px solid hsl(210, 26%, 84%);

  &.is-hidden {
    visibility: hidden;
    opacity: 0;
  }

  &.is-focused {
    visibility: visible;
    opacity: 1;
    transition: visibility 0.2s, opacity 0.2s;
  }

  &__button {
    font-weight: bold;
    display: inline-flex;
    background: transparent;
    border: 0;
    color: #8590a6;
    padding: 0.2rem 0.3rem;
    margin-right: 0.2rem;
    border-radius: 3px;
    cursor: pointer;

    &:hover {
      color: #76839b;
      background-color: rgba($color-black, 0.05);
    }

    &.is-active {
      color: hsl(210, 100%, 51%);
    }
  }
  .menubar__title {
    vertical-align: top;
  }
  .button-title {
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    font-size: 14px;
    letter-spacing: -1px;
  }
  .menubar__button--font {
    display: flex;
    align-items: center;
    height: 24px;
    font-size: 14px;
  }
  .font-size-picker-container {
    position: relative;
    display: inline-block;
    vertical-align: top;
  }
  .font-size-picker {
    list-style: none;
    z-index: 100;
    position: absolute;
    background: #ffffff;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
      0 4px 6px -2px rgba(0, 0, 0, 0.05);
    top: 100%;
    left: 0;
    padding: 0;
    margin: 0;

    width: 50px;
  }
  .color-picker {
    z-index: 100;
    width: 300px;
    position: absolute;
    border-radius: 8px;
    /* background: hsl(225, 12%, 15%); */
    background: hsl(214, 31%, 91%);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
      0 4px 6px -2px rgba(0, 0, 0, 0.05);
    top: 100%;
    left: 0;
    padding: 2px 2px;
    transform: translateX(-50%);
  }
  .font-size-picker > li {
    width: 100%;
    padding: 0;
    &:hover {
      background: hsl(214, 31%, 91%);
    }
  }
  .font-size-picker-button {
    width: 100%;
    font-weight: bold;
    font-size: 14px;
    display: inline-flex;
    background: transparent;
    border: 0;
    color: #8590a6;
    padding: 0.5rem 0.5rem;
    border-radius: 3px;
    cursor: pointer;
  }
}
img {
  max-width: 100%;
}
.tooltip {
  display: block !important;
  z-index: 100;
}

.tooltip .tooltip-inner {
  background: black;
  color: white;
  border-radius: 4px;
  padding: 5px 10px 4px;
}

.tooltip .tooltip-arrow {
  width: 0;
  height: 0;
  border-style: solid;
  position: absolute;
  margin: 5px;
  border-color: black;
  z-index: 1;
}

.tooltip[x-placement^='top'] {
  margin-bottom: 5px;
}

.tooltip[x-placement^='top'] .tooltip-arrow {
  border-width: 5px 5px 0 5px;
  border-left-color: transparent !important;
  border-right-color: transparent !important;
  border-bottom-color: transparent !important;
  bottom: -5px;
  left: calc(50% - 5px);
  margin-top: 0;
  margin-bottom: 0;
}

.tooltip[x-placement^='bottom'] {
  margin-top: 5px;
}

.tooltip[x-placement^='bottom'] .tooltip-arrow {
  border-width: 0 5px 5px 5px;
  border-left-color: transparent !important;
  border-right-color: transparent !important;
  border-top-color: transparent !important;
  top: -5px;
  left: calc(50% - 5px);
  margin-top: 0;
  margin-bottom: 0;
}

.tooltip[x-placement^='right'] {
  margin-left: 5px;
}

.tooltip[x-placement^='right'] .tooltip-arrow {
  border-width: 5px 5px 5px 0;
  border-left-color: transparent !important;
  border-top-color: transparent !important;
  border-bottom-color: transparent !important;
  left: -5px;
  top: calc(50% - 5px);
  margin-left: 0;
  margin-right: 0;
}

.tooltip[x-placement^='left'] {
  margin-right: 5px;
}

.tooltip[x-placement^='left'] .tooltip-arrow {
  border-width: 5px 0 5px 5px;
  border-top-color: transparent !important;
  border-right-color: transparent !important;
  border-bottom-color: transparent !important;
  right: -5px;
  top: calc(50% - 5px);
  margin-left: 0;
  margin-right: 0;
}

.tooltip.popover .popover-inner {
  background: #f9f9f9;
  color: black;
  padding: 24px;
  border-radius: 5px;
  box-shadow: 0 5px 30px rgba(black, 0.1);
}

.tooltip.popover .popover-arrow {
  border-color: #f9f9f9;
}

.tooltip[aria-hidden='true'] {
  visibility: hidden;
  opacity: 0;
  transition: opacity 0.15s, visibility 0.15s;
}

.tooltip[aria-hidden='false'] {
  visibility: visible;
  opacity: 1;
  transition: opacity 0.15s;
}
</style>
